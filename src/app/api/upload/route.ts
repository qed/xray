import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DEPARTMENTS_DIR = path.join(process.cwd(), 'artifacts', 'WeVend X-Ray');
const STATUS_FILE = path.join(process.cwd(), 'artifacts', 'status.json');

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function countPriorities(content: string): number {
  const matches = content.match(/^#{2,3}\s+Priority\s+\d+/gm);
  return matches ? matches.length : 0;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileType = formData.get('fileType') as string | null;
    const slug = formData.get('slug') as string | null;
    const newDepartmentName = formData.get('newDepartmentName') as string | null;

    if (!file || !fileType || (!slug && !newDepartmentName)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only .md files are accepted. Use an LLM like Claude to convert your document to markdown first.' },
        { status: 400 }
      );
    }

    const departmentSlug = slug === '__new__'
      ? slugify(newDepartmentName ?? '')
      : slug!;

    if (!departmentSlug) {
      return NextResponse.json({ error: 'Invalid department name' }, { status: 400 });
    }

    const deptDir = path.join(DEPARTMENTS_DIR, departmentSlug);
    if (!fs.existsSync(deptDir)) {
      fs.mkdirSync(deptDir, { recursive: true });
    }

    const content = await file.text();
    const targetFilename = fileType === 'profile'
      ? 'department_profile.md'
      : 'automation_priorities.md';

    fs.writeFileSync(path.join(deptDir, targetFilename), content, 'utf-8');

    // For automation priorities: ensure status.json has entries
    if (fileType === 'priorities') {
      const priorityCount = countPriorities(content);
      if (priorityCount > 0) {
        const statusRaw = fs.readFileSync(STATUS_FILE, 'utf-8');
        const statuses = JSON.parse(statusRaw);
        let updated = false;

        for (let i = 1; i <= priorityCount; i++) {
          const key = `${departmentSlug}/priority-${i}`;
          if (!statuses[key]) {
            statuses[key] = { milestone: 0, updated: new Date().toISOString().split('T')[0], notes: '' };
            updated = true;
          }
        }

        if (updated) {
          fs.writeFileSync(STATUS_FILE, JSON.stringify(statuses, null, 2), 'utf-8');
        }
      }
    }

    return NextResponse.json({ slug: departmentSlug });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
