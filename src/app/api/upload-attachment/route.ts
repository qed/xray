import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv',
  'text/plain': 'txt',
  'text/markdown': 'md',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
};

// Also allow by extension for cases where MIME type is generic
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'md', 'png', 'jpg', 'jpeg', 'gif'];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isAllowedMime = !!ALLOWED_TYPES[file.type];
  const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);

  if (!isAllowedMime && !isAllowedExt) {
    return NextResponse.json(
      { error: `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const uuid = randomUUID();
  const storagePath = `${uuid}/${file.name}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from('chat-attachments')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  // Save metadata to message_attachments table
  await admin.from('message_attachments').insert({
    storage_path: storagePath,
    file_name: file.name,
    file_type: file.type || `application/${ext}`,
    file_size: file.size,
    uploaded_by: user.id,
  });

  return NextResponse.json({
    storagePath,
    fileName: file.name,
    fileType: file.type || `application/${ext}`,
    fileSize: file.size,
  });
}
