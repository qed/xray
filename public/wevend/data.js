// CSuite Dashboard Data — WeVend Test Case
// 12 departments, 106 priorities sourced from X-Ray Automation Priorities documents
// Status values: "Not Started", "In Progress", "Completed" (per R8)
// All field values are strings (per plan decision)

// Department color palettes — keyed by department slug
var DEPARTMENT_COLORS = {
  "accounting":                { primary: "#2E7D32", secondary: "#66BB6A", tertiary: "#A5D6A7", light: "rgba(46,125,50,0.1)",   border: "#2E7D32" },
  "c-suite":                   { primary: "#1A1A2E", secondary: "#4A4A6A", tertiary: "#8888AA", light: "rgba(26,26,46,0.1)",    border: "#1A1A2E" },
  "engineering":               { primary: "#1565C0", secondary: "#42A5F5", tertiary: "#90CAF9", light: "rgba(21,101,192,0.1)",  border: "#1565C0" },
  "human-resources":           { primary: "#AD1457", secondary: "#EC407A", tertiary: "#F48FB1", light: "rgba(173,20,87,0.1)",   border: "#AD1457" },
  "it-monex":                  { primary: "#00838F", secondary: "#26C6DA", tertiary: "#80DEEA", light: "rgba(0,131,143,0.1)",   border: "#00838F" },
  "infrastructure-compliance": { primary: "#E65100", secondary: "#FF9800", tertiary: "#FFCC80", light: "rgba(230,81,0,0.1)",    border: "#E65100" },
  "marketing":                 { primary: "#6A1B9A", secondary: "#AB47BC", tertiary: "#CE93D8", light: "rgba(106,27,154,0.1)",  border: "#6A1B9A" },
  "operations":                { primary: "#283593", secondary: "#5C6BC0", tertiary: "#9FA8DA", light: "rgba(40,53,147,0.1)",   border: "#283593" },
  "product-management":        { primary: "#4E342E", secondary: "#8D6E63", tertiary: "#BCAAA4", light: "rgba(78,52,46,0.1)",    border: "#4E342E" },
  "sales-operations":          { primary: "#BF360C", secondary: "#FF7043", tertiary: "#FFAB91", light: "rgba(191,54,12,0.1)",   border: "#BF360C" },
  "sales-wevend":              { primary: "#00695C", secondary: "#26A69A", tertiary: "#80CBC4", light: "rgba(0,105,92,0.1)",    border: "#00695C" },
  "sales-monex":               { primary: "#F57F17", secondary: "#FDD835", tertiary: "#FFF59D", light: "rgba(245,127,23,0.1)", border: "#F57F17" }
};

const CSUITE_DATA = {
  company: "WeVend",
  departments: [

    // === ACCOUNTING ===
    {
      name: "Accounting",
      slug: "accounting",
      priorities: [
        {
          rank: 1,
          name: "Sales Orders & Invoicing — System-Generated POs",
          slug: "sales-orders-invoicing-system-generated-pos",
          status: "Not Started",
          who: "Nancy",
          weekly_hours: "~2.5 hrs",
          monthly_hours: "~10 hrs",
          complexity: "Low",
          impact: "High",
          description: "Eliminate duplicate customer setup in QBO and Clover by moving to system-generated POs that are QBO-ready before reaching Accounting.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Weekly PO Volume", value: "10", subtitle: "~480 invoices/year" },
              { label: "Avg Processing Time", value: "16 min", subtitle: "Per deal (dual entry)" },
              { label: "Weekly Time Cost", value: "2.7 hrs", subtitle: "Manual dual entry" },
              { label: "Error Rate", value: "3.2%", subtitle: "Duplicate entry errors" }
            ],
            summary: "Sales order processing currently handles approximately 10 POs per week with an average of 16 minutes per deal across QBO and Clover dual entry. The 3.2% error rate on duplicate entries has remained stubbornly above target despite template improvements. Weekly time cost of 2.7 hours represents a clear automation opportunity as deal volume grows.",
            charts: [
              {
                id: "acct-po-volume",
                title: "Daily PO Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "POs Processed", data: [2,3,1,2,3,2,1,3,2,2,3,2,1,2,3,2,2,3,1,2,3,2] }
                  ]
                }
              },
              {
                id: "acct-po-processing-time",
                title: "Avg Processing Time per PO (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Processing Time (min)", data: [18,15,17,14,16,19,15,13,16,17,14,16,18,15,13,17,16,14,15,16,13,15] }
                  ]
                }
              },
              {
                id: "acct-po-error-rate",
                title: "Weekly Error Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Error Rate %", data: [4.1,3.8,3.5,3.9,3.2,4.0,3.6,3.3,3.7,3.1,3.4,3.8,3.2,3.5,2.9,3.6,3.3,3.1,3.4,3.0,2.8,3.2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["PO Number", "Customer", "Rep", "Entity", "QBO Status", "Clover Status", "Time (min)", "Date"],
              rows: [
                ["PO-2026-0412", "Maple Leaf Vending", "Oswin", "MONEX CAD", "Imported", "Pending", "14", "Apr 7"],
                ["PO-2026-0411", "Pacific Coast Snacks", "Rob D.", "WeVend USD", "Imported", "Imported", "12", "Apr 7"],
                ["PO-2026-0410", "Metro Refreshments", "Oswin", "MONEX CAD", "Imported", "Pending", "18", "Apr 6"],
                ["PO-2026-0409", "Sunrise Vending Co", "Tyler", "WeVend USD", "Imported", "Imported", "15", "Apr 6"],
                ["PO-2026-0408", "Lakeshore Retail", "Rob D.", "MONEX CAD", "Error", "Pending", "22", "Apr 3"],
                ["PO-2026-0407", "Summit Food Services", "Oswin", "WeVend USD", "Imported", "Imported", "13", "Apr 3"],
                ["PO-2026-0406", "Evergreen Markets", "Tyler", "MONEX CAD", "Imported", "Pending", "16", "Apr 2"],
                ["PO-2026-0405", "Downtown Deli Group", "Rob D.", "MONEX CAD", "Imported", "Imported", "14", "Apr 1"]
              ],
              badges: {
                4: { "Imported": "success", "Pending": "warning", "Error": "danger" },
                5: { "Imported": "success", "Pending": "warning", "Error": "danger" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Corporate Credit Cards & Bank/VISA Statement Access",
          slug: "corporate-credit-cards-bank-visa-statement-access",
          status: "Not Started",
          who: "Nancy, Kylie",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Low",
          impact: "High",
          description: "Issue corporate credit cards and grant Accounting direct daily visibility into card spend, eliminating dependency on personal VISA statements.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Statement Delay", value: "5-6 wks", subtitle: "Current blind spot" },
              { label: "Monthly Statements", value: "2", subtitle: "CAD + USD VISA" },
              { label: "Reconciliation Time", value: "4 hrs/mo", subtitle: "QBD reconciliation" },
              { label: "Prep Drag", value: "1-2 wks", subtitle: "Per statement cycle" }
            ],
            summary: "VISA statement access currently operates with a 5-6 week blind spot before Accounting sees transactions. The 2 monthly statements require 4 hours of QBD reconciliation time plus 1-2 weeks of preparation drag per cycle. Transitioning to corporate cards with RBC Express daily access would collapse the preparation phase into real-time daily checks.",
            charts: [
              {
                id: "acct-visa-transaction-lag",
                title: "Transaction Visibility Lag (Days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Current Lag (days)", data: [38,39,40,41,35,36,37,38,39,40,34,35,36,37,38,33,34,35,36,37,38,39] },
                    { label: "Target with RBC Express", data: [2,2,1,2,1,2,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2] }
                  ]
                }
              },
              {
                id: "acct-visa-spend-by-dept",
                title: "Monthly Card Spend by Department ($)",
                type: "stacked-bar",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Sales", data: [4200,3800,5100,4600,4900,5300] },
                    { label: "Operations", data: [2800,3100,2600,2900,3200,3400] },
                    { label: "IT", data: [1500,1200,1800,1400,1600,1700] },
                    { label: "Other", data: [900,1100,800,1000,1200,950] }
                  ]
                }
              },
              {
                id: "acct-visa-missing-receipts",
                title: "Missing Receipts at Month-End",
                type: "bar",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Missing Receipts", data: [12,15,18,14,11,16] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Transaction Date", "Cardholder", "Vendor", "Amount", "Currency", "Receipt", "Department", "Status"],
              rows: [
                ["Apr 6", "John G.", "Amazon AWS", "$1,247.00", "USD", "Missing", "IT", "Unreconciled"],
                ["Apr 4", "John G.", "Staples Canada", "$189.50", "CAD", "Received", "Operations", "Reconciled"],
                ["Apr 3", "John G.", "Delta Airlines", "$623.00", "USD", "Missing", "Sales", "Unreconciled"],
                ["Apr 2", "John G.", "Uber Eats", "$87.30", "CAD", "Received", "Sales", "Reconciled"],
                ["Apr 1", "John G.", "Home Depot", "$342.15", "CAD", "Missing", "Operations", "Unreconciled"],
                ["Mar 31", "John G.", "Microsoft 365", "$450.00", "USD", "Received", "IT", "Reconciled"],
                ["Mar 28", "John G.", "FedEx Canada", "$156.80", "CAD", "Received", "Operations", "Reconciled"],
                ["Mar 27", "John G.", "WestJet", "$489.00", "CAD", "Missing", "Sales", "Unreconciled"]
              ],
              badges: {
                5: { "Missing": "danger", "Received": "success" },
                7: { "Reconciled": "success", "Unreconciled": "warning" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Clover Payment Notification Auto-Forwarding",
          slug: "clover-payment-notification-auto-forwarding",
          status: "Not Started",
          who: "Nancy",
          weekly_hours: "~10 min",
          monthly_hours: "~40 min",
          complexity: "Low",
          impact: "Medium",
          description: "Auto-forward Clover payment confirmation emails to the relevant sales rep and director without manual intervention.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Weekly Forwards", value: "10", subtitle: "~400/year" },
              { label: "Time per Forward", value: "1 min", subtitle: "Manual process" },
              { label: "Automation Savings", value: "100%", subtitle: "Full elimination" },
              { label: "Weekly Time Saved", value: "10 min", subtitle: "For Nancy" }
            ],
            summary: "Clover payment notifications average 10 manual forwards per week, each taking approximately 1 minute of Nancy's time. With 100% automation savings achievable via an Outlook rule or Power Automate flow, the entire 10 minutes per week of manual forwarding would be eliminated. Volume is projected to grow beyond the pilot stage as deal flow increases.",
            charts: [
              {
                id: "acct-clover-daily-forwards",
                title: "Daily Clover Notifications",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Notifications", data: [2,1,3,2,1,2,3,1,2,2,3,1,2,2,3,1,2,3,2,1,2,3] }
                  ]
                }
              },
              {
                id: "acct-clover-forward-status",
                title: "Forward Status Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Forwarded Same Day", "Forwarded Next Day", "Delayed 2+ Days"],
                  datasets: [
                    { data: [82,14,4] }
                  ]
                }
              },
              {
                id: "acct-clover-weekly-volume",
                title: "Weekly Notification Volume Trend",
                type: "line",
                data: {
                  labels: ["W1 Jan","W2 Jan","W3 Jan","W4 Jan","W1 Feb","W2 Feb","W3 Feb","W4 Feb","W1 Mar","W2 Mar","W3 Mar","W4 Mar"],
                  datasets: [
                    { label: "Weekly Volume", data: [7,8,9,8,10,9,11,10,12,10,11,13] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Date", "Clover Ref", "Customer", "Amount", "Rep", "Director", "Forward Status"],
              rows: [
                ["Apr 7", "CLV-9847", "Maple Leaf Vending", "$2,340.00", "Oswin", "Rob D.", "Forwarded"],
                ["Apr 7", "CLV-9846", "Summit Food Services", "$1,875.00", "Tyler", "Rob D.", "Forwarded"],
                ["Apr 6", "CLV-9845", "Metro Refreshments", "$3,120.00", "Oswin", "Rob D.", "Forwarded"],
                ["Apr 6", "CLV-9844", "Sunrise Vending Co", "$890.00", "Tyler", "Rob D.", "Pending"],
                ["Apr 3", "CLV-9843", "Downtown Deli Group", "$1,560.00", "Rob D.", "Oswin", "Forwarded"],
                ["Apr 3", "CLV-9842", "Lakeshore Retail", "$2,780.00", "Oswin", "Rob D.", "Forwarded"],
                ["Apr 2", "CLV-9841", "Pacific Coast Snacks", "$1,245.00", "Tyler", "Rob D.", "Forwarded"],
                ["Apr 1", "CLV-9840", "Evergreen Markets", "$4,100.00", "Oswin", "Rob D.", "Delayed"]
              ],
              badges: {
                6: { "Forwarded": "success", "Pending": "warning", "Delayed": "danger" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Invoice & Expense Approval Workflow",
          slug: "invoice-expense-approval-workflow",
          status: "Not Started",
          who: "Kylie",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "High",
          description: "Replace email-based approval process with a centralized workflow including automated reminders and audit trail.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Weekly Bills", value: "20", subtitle: "~750 bills/year" },
              { label: "Avg Approval Rounds", value: "2.4", subtitle: "Email exchanges per bill" },
              { label: "Avg Approval Time", value: "3.2 wks", subtitle: "Submission to final" },
              { label: "Outstanding Approvals", value: "34", subtitle: "Currently pending" }
            ],
            summary: "The invoice approval pipeline processes approximately 20 bills per week with an average of 2.4 email rounds per approval and a 3.2-week average cycle time from submission to final sign-off. There are currently 34 outstanding approvals pending manager action. Kylie's daily tracking burden for these outstanding items represents a significant but unquantifiable overhead that a centralized dashboard would eliminate.",
            charts: [
              {
                id: "acct-approval-cycle-time",
                title: "Approval Cycle Time (Days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Avg Cycle Time (days)", data: [18,22,19,25,21,17,23,20,24,19,22,18,21,26,20,17,23,19,22,18,21,20] }
                  ]
                }
              },
              {
                id: "acct-approval-by-manager",
                title: "Pending Approvals by Manager",
                type: "horizontal-bar",
                data: {
                  labels: ["Oswin", "Rob D.", "Scott", "Richard", "Layal", "Peter"],
                  datasets: [
                    { label: "Pending", data: [8,6,7,5,4,4] }
                  ]
                }
              },
              {
                id: "acct-approval-status-mix",
                title: "Approval Status Distribution",
                type: "doughnut",
                data: {
                  labels: ["Approved", "Pending 1st Round", "Pending 2nd Round", "Overdue"],
                  datasets: [
                    { data: [58,18,14,10] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Invoice #", "Vendor", "Amount", "Approver", "Submitted", "Rounds", "Days Pending", "Status"],
              rows: [
                ["INV-3421", "Telus Business", "$4,230.00", "Scott", "Mar 18", "3", "20", "Overdue"],
                ["INV-3418", "Purolator", "$1,890.00", "Rob D.", "Mar 22", "2", "16", "Pending"],
                ["INV-3425", "AWS Canada", "$6,120.00", "Richard", "Mar 25", "1", "13", "Pending"],
                ["INV-3430", "Office Depot", "$342.00", "Oswin", "Mar 27", "2", "11", "Pending"],
                ["INV-3432", "Bell Canada", "$2,780.00", "Scott", "Mar 28", "1", "10", "Pending"],
                ["INV-3435", "Staples", "$198.50", "Layal", "Mar 31", "1", "7", "Pending"],
                ["INV-3438", "FedEx", "$567.00", "Rob D.", "Apr 1", "1", "6", "Approved"],
                ["INV-3441", "Rogers Business", "$1,450.00", "Peter", "Apr 3", "1", "4", "Approved"],
                ["INV-3443", "Shopify Plus", "$890.00", "Richard", "Apr 4", "0", "3", "Pending"],
                ["INV-3445", "Canva Teams", "$145.00", "Oswin", "Apr 6", "0", "1", "Pending"]
              ],
              badges: {
                7: { "Overdue": "danger", "Pending": "warning", "Approved": "success" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Commission Management Platform — MONEX",
          slug: "commission-management-platform-monex",
          status: "Not Started",
          who: "Kylie, Nancy",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "High",
          impact: "Critical",
          description: "Build a centralized commission management platform linked to Phorge deal records, automating calculation and approval.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Active Reps", value: "12", subtitle: "This pay period" },
              { label: "Deals in Queue", value: "47", subtitle: "Awaiting commission calc" },
              { label: "Avg Calc Time", value: "3.2 hrs", subtitle: "Per pay period run" },
              { label: "Error Rate", value: "4.8%", subtitle: "Manual formula errors" }
            ],
            summary: "MONEX commission processing currently covers 12 active reps with 47 deals in the calculation queue this pay period. Each semi-monthly run takes an average of 3.2 hours of manual Excel work by Kylie and Nancy. The 4.8% error rate on manual lease score factor calculations (dividing by 0.0323 or 0.0416) represents a significant risk that grows with rep count and deal volume.",
            charts: [
              {
                id: "acct-commission-by-rep",
                title: "Commission Payouts by Rep ($)",
                type: "bar",
                data: {
                  labels: ["Oswin", "Tyler", "Rob D.", "Marcus", "Sarah", "Dev P.", "James K.", "Lisa M."],
                  datasets: [
                    { label: "Mar 1-15", data: [4200,3100,3800,2900,2100,1800,2400,1600] },
                    { label: "Mar 16-31", data: [3900,3500,4100,2600,2400,2100,2200,1900] }
                  ]
                }
              },
              {
                id: "acct-commission-processing-time",
                title: "Commission Run Processing Time (hrs)",
                type: "line",
                data: {
                  labels: ["Jan 1-15","Jan 16-31","Feb 1-15","Feb 16-28","Mar 1-15","Mar 16-31"],
                  datasets: [
                    { label: "Calc Time", data: [2.8,3.1,3.4,2.9,3.5,3.2] },
                    { label: "Review Time", data: [1.2,1.0,1.4,1.1,1.3,1.0] }
                  ]
                }
              },
              {
                id: "acct-commission-errors",
                title: "Commission Calculation Errors",
                type: "bar",
                data: {
                  labels: ["Jan 1-15","Jan 16-31","Feb 1-15","Feb 16-28","Mar 1-15","Mar 16-31"],
                  datasets: [
                    { label: "Formula Errors", data: [2,1,3,1,2,2] },
                    { label: "Schedule A Mismatches", data: [1,0,1,2,0,1] }
                  ]
                }
              },
              {
                id: "acct-commission-deal-volume",
                title: "Eligible Deals per Pay Period",
                type: "line",
                data: {
                  labels: ["Jan 1-15","Jan 16-31","Feb 1-15","Feb 16-28","Mar 1-15","Mar 16-31"],
                  datasets: [
                    { label: "Eligible Deals", data: [38,42,44,40,48,47] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep", "Deal #", "Lease Score", "Schedule A Rate", "Commission", "Status", "Pay Period"],
              rows: [
                ["Oswin", "PHG-2241", "0.0323", "Tier 2", "$485.00", "Approved", "Mar 16-31"],
                ["Tyler", "PHG-2238", "0.0416", "Tier 1", "$312.00", "Approved", "Mar 16-31"],
                ["Rob D.", "PHG-2235", "0.0323", "Tier 2", "$520.00", "Pending Review", "Mar 16-31"],
                ["Marcus", "PHG-2230", "0.0416", "Tier 1", "$278.00", "Approved", "Mar 16-31"],
                ["Sarah", "PHG-2228", "0.0323", "Tier 3", "$195.00", "Error - Recalc", "Mar 16-31"],
                ["Dev P.", "PHG-2225", "0.0416", "Tier 1", "$210.00", "Pending Review", "Mar 16-31"],
                ["James K.", "PHG-2222", "0.0323", "Tier 2", "$340.00", "Approved", "Mar 16-31"],
                ["Lisa M.", "PHG-2220", "0.0416", "Tier 1", "$188.00", "Approved", "Mar 16-31"]
              ],
              badges: {
                5: { "Approved": "success", "Pending Review": "warning", "Error - Recalc": "danger" }
              }
            }
          }
        },
        {
          rank: 6,
          name: "Phorge Deal Closing — Automation or Streamlining",
          slug: "phorge-deal-closing-automation-or-streamlining",
          status: "Not Started",
          who: "Kylie",
          weekly_hours: "~5 hrs",
          monthly_hours: "~20 hrs",
          complexity: "High",
          impact: "High",
          description: "Reduce manual multi-step Phorge navigation to close deals and terminals; automate or build bulk closure tool.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Daily Deals", value: "3-5", subtitle: "From Admin approval list" },
              { label: "Weekly Time", value: "5 hrs", subtitle: "Kylie's manual closures" },
              { label: "Target Time", value: "<15 min/day", subtitle: "With automation" },
              { label: "Missed Closures", value: "2", subtitle: "This month (wrong date)" }
            ],
            summary: "Phorge deal closing consumes approximately 5 hours per week of Kylie's time across 3-5 deals daily, each with multiple terminals requiring individual navigation. This is the single largest quantified time saving in the department. Two missed closures this month involved incorrect closure dates, impacting downstream commission eligibility and reporting accuracy.",
            charts: [
              {
                id: "acct-phorge-daily-deals",
                title: "Daily Deals Closed",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Deals Closed", data: [4,3,5,3,4,3,5,4,3,4,5,3,4,3,5,4,3,5,4,3,4,5] }
                  ]
                }
              },
              {
                id: "acct-phorge-time-per-deal",
                title: "Avg Time per Deal Closure (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Minutes per Deal", data: [14,16,12,18,15,13,17,14,16,15,12,18,14,16,13,15,17,14,16,15,13,14] }
                  ]
                }
              },
              {
                id: "acct-phorge-terminals-per-deal",
                title: "Terminals per Deal",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Avg Terminals", data: [3,2,4,2,3,3,4,2,3,2,4,3,2,3,4,2,3,4,2,3,3,4] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Deal #", "Customer", "Terminals", "Close Date", "Closure Time", "Errors", "Status"],
              rows: [
                ["PHG-2250", "Maple Leaf Vending", "4", "Apr 7", "18 min", "0", "Closed"],
                ["PHG-2249", "Pacific Coast Snacks", "2", "Apr 7", "10 min", "0", "Closed"],
                ["PHG-2248", "Metro Refreshments", "3", "Apr 6", "14 min", "0", "Closed"],
                ["PHG-2247", "Summit Food Services", "5", "Apr 6", "22 min", "1", "Error"],
                ["PHG-2246", "Lakeshore Retail", "2", "Apr 3", "9 min", "0", "Closed"],
                ["PHG-2245", "Downtown Deli Group", "3", "Apr 3", "15 min", "0", "Closed"],
                ["PHG-2244", "Sunrise Vending Co", "4", "Apr 2", "19 min", "1", "Error"],
                ["PHG-2243", "Evergreen Markets", "2", "Apr 1", "8 min", "0", "Closed"],
                ["PHG-2242", "Northern Snack Co", "3", "Apr 1", "13 min", "0", "Closed"]
              ],
              badges: {
                6: { "Closed": "success", "Error": "danger", "In Progress": "warning" }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Employee Expense Management Platform",
          slug: "employee-expense-management-platform",
          status: "Not Started",
          who: "\u2014",
          weekly_hours: "N/A",
          monthly_hours: "N/A",
          complexity: "Medium",
          impact: "Medium",
          description: "Implement a unified expense submission and approval platform replacing the email-based system.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Monthly Claims", value: "45", subtitle: "Across all employees" },
              { label: "Missing Receipts", value: "28%", subtitle: "At month-end reconciliation" },
              { label: "Avg Approval Time", value: "6.3 days", subtitle: "Email-based process" },
              { label: "Target Approval", value: "<48 hrs", subtitle: "With platform" }
            ],
            summary: "Employee expense claims average 45 per month with a 28% missing receipt rate discovered at month-end reconciliation. The current email-based approval process averages 6.3 days per claim, well above the 48-hour target that a dedicated platform like Ramp or Expensify would enable. Retroactive receipt chasing consumes significant Kylie reconciliation time each month-end cycle.",
            charts: [
              {
                id: "acct-expense-monthly-claims",
                title: "Monthly Expense Claims",
                type: "bar",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Claims Submitted", data: [38,42,51,40,43,45] },
                    { label: "Claims with Missing Receipts", data: [10,13,16,11,12,13] }
                  ]
                }
              },
              {
                id: "acct-expense-approval-time",
                title: "Expense Approval Time (Days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Approval Time (days)", data: [5.2,7.1,6.8,4.9,8.3,5.5,6.2,7.4,5.8,6.1,7.9,5.3,6.5,8.1,5.7,6.3,7.2,5.1,6.8,5.9,7.4,6.3] }
                  ]
                }
              },
              {
                id: "acct-expense-by-category",
                title: "Expense Claims by Category",
                type: "doughnut",
                data: {
                  labels: ["Travel", "Office Supplies", "Client Entertainment", "Software/SaaS", "Shipping", "Other"],
                  datasets: [
                    { data: [32,22,18,15,8,5] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Claim ID", "Employee", "Category", "Amount", "Submitted", "Receipt", "Approval Status"],
              rows: [
                ["EXP-0289", "Tyler K.", "Travel", "$478.00", "Apr 5", "Missing", "Pending"],
                ["EXP-0288", "Oswin M.", "Client Entertainment", "$125.00", "Apr 4", "Attached", "Approved"],
                ["EXP-0287", "Scott P.", "Office Supplies", "$89.50", "Apr 3", "Attached", "Approved"],
                ["EXP-0286", "Layal S.", "Software/SaaS", "$199.00", "Apr 2", "Missing", "Pending"],
                ["EXP-0285", "Rob D.", "Travel", "$623.00", "Apr 1", "Attached", "Approved"],
                ["EXP-0284", "Marcus T.", "Shipping", "$67.30", "Mar 31", "Attached", "Approved"],
                ["EXP-0283", "Sarah L.", "Client Entertainment", "$210.00", "Mar 28", "Missing", "Overdue"],
                ["EXP-0282", "Dev P.", "Travel", "$345.00", "Mar 27", "Attached", "Approved"]
              ],
              badges: {
                5: { "Missing": "danger", "Attached": "success" },
                6: { "Approved": "success", "Pending": "warning", "Overdue": "danger" }
              }
            }
          }
        },
        {
          rank: 8,
          name: "Commission Management Platform — WeVend",
          slug: "commission-management-platform-wevend",
          status: "Not Started",
          who: "\u2014",
          weekly_hours: "Blocked",
          monthly_hours: "Blocked",
          complexity: "High",
          impact: "High",
          description: "Build commission tracking platform linked to WeVend deal records once the new database is in place.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Current Status", value: "Blocked", subtitle: "Awaiting WeVend DB" },
              { label: "Active Distributors", value: "6", subtitle: "Pilot + existing" },
              { label: "Pilot Deals", value: "14", subtitle: "Manual QBO pull" },
              { label: "Hardware Rate", value: "3.75-5%", subtitle: "Of retail price" }
            ],
            summary: "WeVend commission management remains blocked pending the new WeVend database rollout. Currently 6 active distributors handle 14 pilot deals requiring manual QBO invoice pulls at hardware commission rates of 3.75-5% of retail price. While manageable at current low volume, the manual process will break as WeVend scales toward 10,000 terminals and more distributors are onboarded.",
            charts: [
              {
                id: "acct-wevend-distributor-deals",
                title: "Distributor Deal Volume (Monthly)",
                type: "bar",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Pilot Deals", data: [4,6,5,8,10,14] },
                    { label: "Distributor Deals", data: [2,3,3,4,5,6] }
                  ]
                }
              },
              {
                id: "acct-wevend-commission-payout",
                title: "Monthly Commission Payouts ($)",
                type: "line",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Hardware Commission", data: [1200,1800,1650,2400,3100,4200] },
                    { label: "Processing Commission", data: [800,1100,950,1400,1800,2500] }
                  ]
                }
              },
              {
                id: "acct-wevend-readiness",
                title: "Platform Readiness Checklist",
                type: "horizontal-bar",
                data: {
                  labels: ["WeVend DB Design", "Data Schema", "Commission Logic", "Rep Assignment", "Approval Workflow", "Audit Trail"],
                  datasets: [
                    { label: "% Complete", data: [15,10,5,0,0,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Distributor", "Deal #", "Terminal Type", "Retail Price", "Rate", "Commission", "Status"],
              rows: [
                ["NorthStar Dist.", "WV-1014", "Smart Cooler", "$3,200.00", "5%", "$160.00", "Paid"],
                ["Pacific Vendors", "WV-1013", "Full-Line Vend", "$4,800.00", "3.75%", "$180.00", "Paid"],
                ["Metro Partners", "WV-1012", "Bulk Vending", "$1,200.00", "5%", "$60.00", "Pending"],
                ["NorthStar Dist.", "WV-1011", "Smart Cooler", "$3,200.00", "5%", "$160.00", "Paid"],
                ["Great Lakes Dist.", "WV-1010", "Full-Line Vend", "$4,800.00", "3.75%", "$180.00", "Pending"],
                ["Pacific Vendors", "WV-1009", "Bulk Vending", "$1,200.00", "5%", "$60.00", "Paid"],
                ["Coastal Vending", "WV-1008", "Smart Cooler", "$3,200.00", "3.75%", "$120.00", "Blocked"],
                ["Metro Partners", "WV-1007", "Full-Line Vend", "$4,800.00", "5%", "$240.00", "Blocked"]
              ],
              badges: {
                6: { "Paid": "success", "Pending": "warning", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 9,
          name: "Entity Separation — Accounting Readiness Plan",
          slug: "entity-separation-accounting-readiness-plan",
          status: "Not Started",
          who: "\u2014",
          weekly_hours: "N/A",
          monthly_hours: "N/A",
          complexity: "Medium",
          impact: "Critical",
          description: "Create a structured project plan for completing WeVend/MONEX entity separation in QBD and QBO.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Entities to Separate", value: "3", subtitle: "WeVend from MONEX/POS" },
              { label: "Affected Employees", value: "All WeVend", subtitle: "Currently under POS entity" },
              { label: "Timeline Set", value: "No", subtitle: "Awaiting leadership decision" },
              { label: "Phase", value: "Planning", subtitle: "Pre-separation readiness" }
            ],
            summary: "Entity separation involves splitting 3 entities (WeVend from MONEX/POS structures) in both QBD and QBO. All WeVend employees currently sit under the POS (MONEX Canadian) entity with no confirmed timeline for the move. The planning phase requires GL account design, chart of accounts restructuring, and external accountant review before any migration can begin.",
            charts: [
              {
                id: "acct-entity-task-progress",
                title: "Separation Task Progress",
                type: "horizontal-bar",
                data: {
                  labels: ["CoA Design", "GL Account Setup", "Employee Migration", "Opening Balances", "Parallel Run", "QBO Mirror Setup"],
                  datasets: [
                    { label: "% Complete", data: [20,10,0,0,0,0] }
                  ]
                }
              },
              {
                id: "acct-entity-risk-matrix",
                title: "Risk Assessment by Category",
                type: "bar",
                data: {
                  labels: ["Payroll Disruption", "GL Errors", "CRA Deadlines", "Team Burnout", "Data Loss", "Compliance Gap"],
                  datasets: [
                    { label: "Risk Level (1-10)", data: [8,7,9,8,5,7] }
                  ]
                }
              },
              {
                id: "acct-entity-timeline",
                title: "Estimated Effort by Phase (Hours)",
                type: "stacked-bar",
                data: {
                  labels: ["Phase 1: CoA", "Phase 2: Payroll", "Phase 3: Balances", "Phase 4: Parallel", "Phase 5: QBO"],
                  datasets: [
                    { label: "Accounting Team", data: [40,30,25,60,35] },
                    { label: "IT Support", data: [10,15,5,20,25] },
                    { label: "External Accountant", data: [20,5,15,10,10] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Task", "Owner", "Dependency", "Est. Hours", "Target Date", "Status"],
              rows: [
                ["Chart of Accounts design for WeVend QBD", "Nancy", "External accountant review", "40", "TBD", "Not Started"],
                ["GL account structure review", "External Accountant", "CoA design complete", "20", "TBD", "Not Started"],
                ["Employee record migration plan", "HR + Nancy", "GL structure approved", "30", "TBD", "Not Started"],
                ["Opening balance entry", "Nancy + Kylie", "Employee migration done", "25", "TBD", "Not Started"],
                ["Intercompany reconciliation", "Kylie", "Opening balances entered", "15", "TBD", "Not Started"],
                ["Parallel run period (4 weeks)", "Nancy + Kylie", "All balances reconciled", "60", "TBD", "Not Started"],
                ["QBO U.S. entity mirror setup", "Nancy", "Parallel run passed", "35", "TBD", "Not Started"],
                ["CRA filing continuity check", "External Accountant", "All phases complete", "10", "TBD", "Not Started"]
              ],
              badges: {
                5: { "Not Started": "neutral", "In Progress": "info", "Complete": "success", "Blocked": "danger" }
              }
            }
          }
        }
      ],
    },

    // === C-SUITE ===
    {
      name: "C-Suite",
      slug: "c-suite",
      priorities: [
        {
          rank: 1,
          name: "KPI Dashboard & Structured Reporting",
          slug: "kpi-dashboard-structured-reporting",
          status: "Not Started",
          who: "Peter, Chris",
          weekly_hours: "4 hrs",
          monthly_hours: "~16 hrs",
          complexity: "High",
          impact: "High",
          description: "Build an automated KPI dashboard pulling data from all 10 departments for C-Suite consumption.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Departments Reporting", value: "2 of 10", subtitle: "Structured data available" },
              { label: "Weekly C-Suite Time", value: "4 hrs", subtitle: "Peter + Chris combined" },
              { label: "Data Freshness", value: "5-7 days", subtitle: "Avg lag on metrics" },
              { label: "KPI Coverage", value: "18%", subtitle: "Of target metrics tracked" }
            ],
            summary: "Only 2 of 10 departments currently provide structured data to the C-Suite, leaving 18% KPI coverage against the target dashboard. Peter and Chris spend a combined 4 hours per week chasing verbal updates with an average data freshness lag of 5-7 days. Terminal activations have grown to 739/month while the C-Suite remains largely blind to department-level performance metrics.",
            charts: [
              {
                id: "csuite-kpi-coverage",
                title: "KPI Coverage by Department (%)",
                type: "horizontal-bar",
                data: {
                  labels: ["Operations", "Sales Ops", "Sales", "Accounting", "Engineering", "Product", "HR", "IT", "Security", "Payment Services"],
                  datasets: [
                    { label: "Coverage %", data: [45,30,15,20,10,12,5,8,5,10] }
                  ]
                }
              },
              {
                id: "csuite-terminal-activations",
                title: "Monthly Terminal Activations",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Daily Activations", data: [32,28,35,30,33,36,29,38,31,34,37,30,35,32,36,34,31,38,33,29,37,35] },
                    { label: "7-Day Avg", data: [30,30,31,31,32,32,32,33,33,33,34,33,34,34,34,34,34,34,34,34,34,34] }
                  ]
                }
              },
              {
                id: "csuite-revenue-segments",
                title: "Revenue by Segment ($K)",
                type: "stacked-bar",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Terminal Sales", data: [180,195,210,225,240,260] },
                    { label: "Processing Revenue", data: [120,135,148,160,175,190] },
                    { label: "Service Contracts", data: [45,48,52,55,58,62] }
                  ]
                }
              },
              {
                id: "csuite-mrr-per-terminal",
                title: "MRR per Terminal ($)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "MRR per Terminal", data: [42.3,42.1,42.5,42.8,42.2,42.6,42.9,42.4,42.7,43.0,42.6,42.8,43.1,42.5,42.9,43.2,42.7,43.0,43.3,42.8,43.1,43.4] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Department", "KPI", "Current Value", "Target", "Trend", "Data Source", "Status"],
              rows: [
                ["Operations", "Terminal Activations/Month", "739", "1,500", "Up", "WeTrack", "On Track"],
                ["Sales", "New Merchants/Month", "28", "50", "Up", "WeSell", "Behind"],
                ["Sales Ops", "Avg Onboarding Time (days)", "12.3", "7", "Flat", "Spreadsheet", "Behind"],
                ["Accounting", "AR Aging >60 Days", "$48,200", "<$25,000", "Up", "QBO", "At Risk"],
                ["Operations", "CS Avg Resolution (hrs)", "4.2", "2", "Down", "Zendesk", "Improving"],
                ["Product", "Sprint Velocity", "34 pts", "40 pts", "Up", "Jira", "On Track"],
                ["Engineering", "Deploy Frequency/Week", "2.4", "5", "Up", "GitHub", "Behind"],
                ["HR", "Open Positions", "7", "0", "Flat", "Manual", "Behind"],
                ["Sales", "New Distributors/Month", "3", "6", "Up", "WeSell", "Behind"]
              ],
              badges: {
                6: { "On Track": "success", "Behind": "warning", "At Risk": "danger", "Improving": "info" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Board/Leadership Reporting",
          slug: "board-leadership-reporting",
          status: "Not Started",
          who: "Peter, Chris",
          weekly_hours: "4 hrs",
          monthly_hours: "~16 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Auto-generate a consolidated board-ready report synthesizing KPIs and project status updates.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Report Frequency", value: "Weekly", subtitle: "Feeding strategic meetings" },
              { label: "Prep Time Saved", value: "4 hrs/wk", subtitle: "Peter + Chris combined" },
              { label: "Report Sections", value: "6", subtitle: "KPIs, projects, risks, etc." },
              { label: "Current State", value: "None", subtitle: "No formal board reporting" }
            ],
            summary: "No formal board reporting process currently exists, representing 4 hours per week of unrealized prep value for Peter and Chris. Strategic meetings between Peter, Chris, and John Gedeon lack structured data across all 6 target report sections. Automating report generation from the KPI dashboard would enable data-driven strategic decisions at the current growth trajectory.",
            charts: [
              {
                id: "csuite-board-report-sections",
                title: "Report Section Readiness",
                type: "horizontal-bar",
                data: {
                  labels: ["KPI Summary", "Department Status", "Project Updates", "Risk Items", "Recruiting/HR", "Financial Overview"],
                  datasets: [
                    { label: "Data Availability %", data: [25,15,35,10,20,30] }
                  ]
                }
              },
              {
                id: "csuite-board-meeting-efficiency",
                title: "Strategic Meeting Time Allocation (min)",
                type: "stacked-bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"],
                  datasets: [
                    { label: "Status Updates (low value)", data: [45,50,40,55,42,48] },
                    { label: "Analysis/Discussion", data: [25,20,30,18,28,22] },
                    { label: "Decision Making", data: [15,10,20,12,18,15] }
                  ]
                }
              },
              {
                id: "csuite-board-decisions-tracked",
                title: "Decisions Made vs Tracked",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Decisions Made", data: [3,2,4,1,3,2,4,3,2,3,4,2,3,1,4,2,3,4,2,3,4,3] },
                    { label: "Formally Tracked", data: [0,0,1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,1,0,0,1,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Meeting Date", "Type", "Attendees", "Decisions", "Action Items", "Documented", "Status"],
              rows: [
                ["Apr 7", "Weekly Management", "Peter, Chris, Dept Heads", "4", "7", "No", "Completed"],
                ["Apr 6", "Strategic - P/C/J", "Peter, Chris, John G.", "3", "5", "No", "Completed"],
                ["Apr 3", "Weekly Sales Call", "Peter, Oswin, Sales", "2", "4", "No", "Completed"],
                ["Mar 31", "Weekly Management", "Peter, Chris, Dept Heads", "5", "8", "No", "Completed"],
                ["Mar 27", "Strategic - P/C/J", "Peter, Chris, John G.", "4", "6", "No", "Completed"],
                ["Mar 24", "Weekly Management", "Peter, Chris, Dept Heads", "3", "5", "No", "Completed"],
                ["Mar 20", "Weekly Sales Call", "Peter, Oswin, Sales", "2", "3", "No", "Completed"],
                ["Mar 17", "Strategic - P/C/J", "Peter, Chris, John G.", "5", "7", "No", "Completed"]
              ],
              badges: {
                5: { "No": "danger", "Partial": "warning", "Yes": "success" },
                6: { "Completed": "success", "Scheduled": "info", "Cancelled": "neutral" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Sales Pipeline Tool",
          slug: "sales-pipeline-tool",
          status: "Not Started",
          who: "Peter, Oswin, Sales team",
          weekly_hours: "~2.1 hrs",
          monthly_hours: "~8.4 hrs",
          complexity: "High",
          impact: "High",
          description: "Implement a proper sales pipeline tool with deal tracking, forecasting, and visibility replacing notebooks and mental tracking.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Active Deals", value: "23", subtitle: "In Peter's notebook" },
              { label: "Pipeline Value", value: "$1.2M", subtitle: "Estimated total" },
              { label: "Forecast Accuracy", value: "Unknown", subtitle: "No tracking system" },
              { label: "Weekly Pipeline Time", value: "3 hrs", subtitle: "Manual tracking" }
            ],
            summary: "The sales pipeline currently holds an estimated 23 active deals worth approximately $1.2M, all tracked in Peter's notebook with no system visibility. Forecast accuracy is completely unknown without structured stage management. The 3 hours per week spent on manual pipeline tracking across Peter, Oswin, and the sales team represents a high-risk single point of failure for deal intelligence.",
            charts: [
              {
                id: "csuite-pipeline-by-stage",
                title: "Pipeline by Deal Stage ($K)",
                type: "bar",
                data: {
                  labels: ["Prospect", "Qualified", "Proposal", "Negotiation", "Closing", "Won"],
                  datasets: [
                    { label: "Deal Value ($K)", data: [280,210,320,180,145,65] }
                  ]
                }
              },
              {
                id: "csuite-pipeline-velocity",
                title: "Weekly Deal Movement",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Deals Added", data: [2,1,0,1,2,1,0,2,1,0,1,2,0,1,2,1,0,2,1,0,1,2] },
                    { label: "Deals Won", data: [0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0] },
                    { label: "Deals Lost", data: [0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0] }
                  ]
                }
              },
              {
                id: "csuite-pipeline-owner",
                title: "Pipeline Value by Owner ($K)",
                type: "doughnut",
                data: {
                  labels: ["Peter", "Oswin", "Rob Downtown", "Tyler", "Other Reps"],
                  datasets: [
                    { data: [420,310,240,130,100] }
                  ]
                }
              },
              {
                id: "csuite-pipeline-aging",
                title: "Deal Age Distribution (Days)",
                type: "bar",
                data: {
                  labels: ["0-7 days", "8-14 days", "15-30 days", "31-60 days", "60+ days"],
                  datasets: [
                    { label: "Number of Deals", data: [5,6,4,5,3] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Deal", "Customer", "Owner", "Stage", "Value", "Age (days)", "Next Step", "Risk"],
              rows: [
                ["D-2026-023", "National Vending Corp", "Peter", "Negotiation", "$185,000", "42", "Final pricing review", "Medium"],
                ["D-2026-022", "GreenLeaf Retail", "Oswin", "Proposal", "$120,000", "18", "Send revised proposal", "Low"],
                ["D-2026-021", "CityWide Snacks", "Rob D.", "Qualified", "$95,000", "28", "Schedule demo", "Low"],
                ["D-2026-020", "Alpine Food Services", "Peter", "Closing", "$210,000", "55", "Contract review", "High"],
                ["D-2026-019", "Lakefront Markets", "Tyler", "Prospect", "$65,000", "7", "Initial call", "Low"],
                ["D-2026-018", "Metro Hospitality", "Oswin", "Negotiation", "$145,000", "35", "Pricing approval", "Medium"],
                ["D-2026-017", "Prairie Vending Co", "Peter", "Proposal", "$88,000", "22", "Technical review", "Low"],
                ["D-2026-016", "Coastal Refreshments", "Rob D.", "Qualified", "$72,000", "14", "Needs assessment", "Low"]
              ],
              badges: {
                7: { "Low": "success", "Medium": "warning", "High": "danger" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Email Noise Reduction",
          slug: "email-noise-reduction",
          status: "Not Started",
          who: "Peter, Chris",
          weekly_hours: "~2.75 hrs",
          monthly_hours: "~11 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Reduce unnecessary CC'd emails reaching Peter and Chris through filtering, routing rules, or cultural change.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Daily CC Emails", value: "~10", subtitle: "Peter's unnecessary CCs" },
              { label: "Weekly Time Cost", value: "3.25 hrs", subtitle: "Peter + Chris combined" },
              { label: "Target Reduction", value: "85%", subtitle: "Filtering + culture change" },
              { label: "Context Switches", value: "~50/wk", subtitle: "Interruptions from CCs" }
            ],
            summary: "Peter receives approximately 10 unnecessary CC'd emails daily while Chris encounters roughly the same, consuming a combined 3.25 hours per week in scanning time. The 50 weekly context switches from these interruptions have an outsized impact on executive focus beyond the raw time cost. An 85% reduction target through Outlook filtering rules and cultural guidelines would recover most of this time.",
            charts: [
              {
                id: "csuite-email-daily-volume",
                title: "Daily Unnecessary CC Emails",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Peter CCs", data: [8,12,9,11,10,7,13,9,11,8,12,10,9,14,8,11,10,7,12,9,10,11] },
                    { label: "Chris CCs", data: [10,14,11,13,12,9,15,11,13,10,14,12,11,16,10,13,12,9,14,11,12,13] }
                  ]
                }
              },
              {
                id: "csuite-email-by-source",
                title: "CC Emails by Source Department",
                type: "doughnut",
                data: {
                  labels: ["Sales", "Operations", "IT", "HR", "Accounting", "External"],
                  datasets: [
                    { data: [35,25,15,10,10,5] }
                  ]
                }
              },
              {
                id: "csuite-email-action-required",
                title: "CC Emails: Action Required vs FYI Only",
                type: "stacked-bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5"],
                  datasets: [
                    { label: "Action Required", data: [8,6,9,7,8] },
                    { label: "FYI Only (filterable)", data: [42,48,39,45,44] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Date", "From", "Subject Pattern", "Recipient", "Action Needed", "Department", "Filterable"],
              rows: [
                ["Apr 7", "Scott P.", "RE: Shipping update - order #4521", "Peter", "No", "Operations", "Yes"],
                ["Apr 7", "Layal S.", "FW: Merchant app received - AutoServe", "Peter", "No", "Sales Ops", "Yes"],
                ["Apr 7", "Tyler K.", "RE: Client follow-up - Metro Foods", "Chris", "No", "Sales", "Yes"],
                ["Apr 6", "Rob M.", "FW: Interview scheduled - QA role", "Chris", "No", "HR", "Yes"],
                ["Apr 6", "Richard M.", "RE: Sprint review notes", "Peter", "No", "Engineering", "Yes"],
                ["Apr 3", "Oswin M.", "RE: Distributor pricing question", "Peter", "Yes", "Sales", "No"],
                ["Apr 3", "Nancy S.", "FW: VISA statement received", "Chris", "No", "Accounting", "Yes"],
                ["Apr 2", "Scott P.", "RE: Terminal RMA #892", "Chris", "No", "Operations", "Yes"]
              ],
              badges: {
                4: { "Yes": "danger", "No": "success" },
                6: { "Yes": "success", "No": "danger" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Pricing Analysis Tool Upgrade",
          slug: "pricing-analysis-tool-upgrade",
          status: "Not Started",
          who: "Peter, Oswin, Layal",
          weekly_hours: "~2.4 hrs",
          monthly_hours: "~9.6 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Upgrade the Excel pricing analysis spreadsheet to handle custom deal analysis faster with auto-populated data and scenarios.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Analyses/Month", value: "6-8", subtitle: "Custom pricing reviews" },
              { label: "Avg Time per Deal", value: "1.5 hrs", subtitle: "Current manual process" },
              { label: "Target Time", value: "45 min", subtitle: "With automation (40% savings)" },
              { label: "At-Scale Volume", value: "18-24/mo", subtitle: "At triple deal volume" }
            ],
            summary: "Custom pricing analyses run 6-8 times per month at approximately 1.5 hours each, involving Peter, Oswin, and Layal. At triple deal volume this will scale to 18-24 analyses monthly, making the current 1.5-hour manual process unsustainable. Targeting a 40% reduction to 45 minutes per analysis by automating data pre-population and scenario modeling while preserving Peter's judgment on pricing strategy.",
            charts: [
              {
                id: "csuite-pricing-time-per-deal",
                title: "Analysis Time per Deal (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Analysis Time (min)", data: [85,92,78,95,88,82,90,75,93,86,80,94,77,91,84,88,76,92,85,79,90,82] }
                  ]
                }
              },
              {
                id: "csuite-pricing-scenarios",
                title: "Scenarios Modeled per Analysis",
                type: "bar",
                data: {
                  labels: ["Jan","Feb","Mar","Apr (proj)"],
                  datasets: [
                    { label: "Avg Scenarios", data: [3.2,3.5,3.8,4.1] },
                    { label: "Max Scenarios", data: [5,6,7,8] }
                  ]
                }
              },
              {
                id: "csuite-pricing-deal-size",
                title: "Custom Deal Size Distribution ($K)",
                type: "doughnut",
                data: {
                  labels: ["<$50K", "$50K-$100K", "$100K-$250K", ">$250K"],
                  datasets: [
                    { data: [15,35,35,15] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Deal", "Customer", "Type", "Value", "Scenarios Run", "Time (min)", "Decision", "Status"],
              rows: [
                ["PRC-042", "National Vending Corp", "Enterprise", "$210,000", "6", "110", "Custom tier approved", "Complete"],
                ["PRC-041", "GreenLeaf Retail", "Mid-Market", "$85,000", "4", "78", "Standard + discount", "Complete"],
                ["PRC-040", "Alpine Food Services", "Enterprise", "$185,000", "5", "95", "Pending Peter review", "In Progress"],
                ["PRC-039", "Metro Hospitality", "Mid-Market", "$72,000", "3", "65", "Standard pricing", "Complete"],
                ["PRC-038", "CityWide Snacks", "Small", "$38,000", "2", "45", "Volume discount", "Complete"],
                ["PRC-037", "Prairie Vending Co", "Mid-Market", "$88,000", "4", "82", "Custom tier approved", "Complete"],
                ["PRC-036", "Coastal Refreshments", "Small", "$42,000", "3", "55", "Standard pricing", "Complete"],
                ["PRC-035", "Lakefront Markets", "Enterprise", "$156,000", "5", "98", "Custom bundle", "Complete"]
              ],
              badges: {
                7: { "Complete": "success", "In Progress": "warning", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 6,
          name: "Visual Project/Product Status Reports",
          slug: "visual-project-product-status-reports",
          status: "Not Started",
          who: "Peter, Chris",
          weekly_hours: "2 hrs",
          monthly_hours: "~8 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Auto-generate visual project and product status reports from Jira data, replacing manual PowerPoint dashboards.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Active Projects", value: "12", subtitle: "Across product + engineering" },
              { label: "Weekly Status Time", value: "2 hrs", subtitle: "Peter + Chris chasing updates" },
              { label: "Prakash PPT Time", value: "2.5 hrs/wk", subtitle: "Manual dashboard build" },
              { label: "Projects On Track", value: "7 of 12", subtitle: "58% on schedule" }
            ],
            summary: "There are 12 active projects across product and engineering with only 7 (58%) currently on track. Peter and Chris spend 2 hours per week chasing status updates while Prakash spends an additional 2.5 hours building manual PowerPoint dashboards. Auto-generating visual reports from Jira data would eliminate both time costs and provide real-time project visibility.",
            charts: [
              {
                id: "csuite-project-status-mix",
                title: "Project Status Distribution",
                type: "doughnut",
                data: {
                  labels: ["On Track", "At Risk", "Behind Schedule", "Blocked"],
                  datasets: [
                    { data: [7,2,2,1] }
                  ]
                }
              },
              {
                id: "csuite-project-completion",
                title: "Major Initiative Completion (%)",
                type: "horizontal-bar",
                data: {
                  labels: ["Full-Line Vending Suite", "Smart Cooler Features", "Bulk Vending Launch", "Laundry Solution", "Payment Gateway v2", "Mobile App Refresh"],
                  datasets: [
                    { label: "% Complete", data: [72,58,45,25,82,65] }
                  ]
                }
              },
              {
                id: "csuite-project-velocity",
                title: "Weekly Sprint Velocity (Story Points)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Completed Points", data: [32,28,35,30,34,31,36,29,33,35,30,37,32,28,34,31,36,33,29,35,32,34] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Project", "Team", "Phase", "% Complete", "Target Date", "Blockers", "Status"],
              rows: [
                ["Full-Line Vending Suite", "Product + Dev", "Development", "72%", "Q2 2026", "None", "On Track"],
                ["Smart Cooler Features", "Product + Dev", "Development", "58%", "Q2 2026", "Hardware spec", "At Risk"],
                ["Bulk Vending Launch", "Product", "Design", "45%", "Q3 2026", "None", "On Track"],
                ["Laundry Solution", "Product", "Requirements", "25%", "Q3 2026", "Vendor TBD", "Behind"],
                ["Payment Gateway v2", "Engineering", "Testing", "82%", "Apr 2026", "Certification", "On Track"],
                ["Mobile App Refresh", "Engineering", "Development", "65%", "May 2026", "None", "On Track"],
                ["CI/CD Pipeline", "Engineering", "Implementation", "40%", "May 2026", "AWS config", "At Risk"],
                ["WeTrack Upgrade", "IT + Ops", "Planning", "15%", "Q3 2026", "Resource", "Behind"],
                ["Commission Platform", "IT + Accounting", "Requirements", "10%", "Q3 2026", "Phorge access", "Blocked"],
                ["CRM Enhancement", "IT + Sales", "Scoping", "5%", "Q4 2026", "Budget", "On Track"]
              ],
              badges: {
                6: { "On Track": "success", "At Risk": "warning", "Behind": "danger", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Centralized Information Collection Tool",
          slug: "centralized-information-collection-tool",
          status: "Not Started",
          who: "Peter",
          weekly_hours: "1 hr",
          monthly_hours: "~4 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Build a tool where Peter can push requests to multiple people and responses are assembled automatically.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Monthly Requests", value: "4-6", subtitle: "Information collection events" },
              { label: "Avg Collection Time", value: "2 hrs", subtitle: "Per request event" },
              { label: "Avg Recipients", value: "8", subtitle: "People per request" },
              { label: "Response Rate", value: "72%", subtitle: "Without follow-up" }
            ],
            summary: "Peter initiates 4-6 information collection events per month, each averaging 2 hours of manual emailing, waiting, and compiling responses from an average of 8 recipients. The 72% initial response rate means significant follow-up chasing is required for most requests. A centralized collection tool would reduce Peter's time per event from 2 hours to under 15 minutes.",
            charts: [
              {
                id: "csuite-collection-response-rate",
                title: "Response Rate by Department (%)",
                type: "horizontal-bar",
                data: {
                  labels: ["Sales", "Operations", "Engineering", "Product", "HR", "Accounting", "IT", "Sales Ops"],
                  datasets: [
                    { label: "Initial Response Rate %", data: [60,85,78,72,90,88,70,75] }
                  ]
                }
              },
              {
                id: "csuite-collection-time-to-complete",
                title: "Time to Full Response (Hours)",
                type: "line",
                data: {
                  labels: ["Jan W1","Jan W3","Feb W1","Feb W3","Mar W1","Mar W3","Apr W1"],
                  datasets: [
                    { label: "Hours to Complete", data: [48,36,52,28,44,32,40] }
                  ]
                }
              },
              {
                id: "csuite-collection-monthly-events",
                title: "Monthly Collection Events",
                type: "bar",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Requests Sent", data: [3,5,4,6,4,5] },
                    { label: "Fully Completed", data: [2,3,3,4,3,4] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Request", "Topic", "Recipients", "Sent", "Responses", "Complete", "Time Spent", "Status"],
              rows: [
                ["REQ-031", "Trade show key clients", "8", "Apr 4", "6/8", "No", "1.5 hrs", "Waiting"],
                ["REQ-030", "Q2 budget inputs", "10", "Mar 28", "10/10", "Yes", "2.5 hrs", "Complete"],
                ["REQ-029", "Distributor feedback summary", "6", "Mar 20", "5/6", "No", "1.8 hrs", "Closed"],
                ["REQ-028", "Product feature requests", "12", "Mar 14", "9/12", "No", "2.2 hrs", "Closed"],
                ["REQ-027", "Hiring needs for Q2", "8", "Mar 7", "8/8", "Yes", "1.5 hrs", "Complete"],
                ["REQ-026", "Customer satisfaction issues", "7", "Feb 28", "5/7", "No", "2.0 hrs", "Closed"],
                ["REQ-025", "Conference attendance list", "10", "Feb 20", "8/10", "No", "1.8 hrs", "Closed"]
              ],
              badges: {
                7: { "Complete": "success", "Waiting": "warning", "Closed": "neutral", "Overdue": "danger" }
              }
            }
          }
        },
        {
          rank: 8,
          name: "Automated AR Follow-Up Reminders",
          slug: "automated-ar-follow-up-reminders",
          status: "Not Started",
          who: "Peter",
          weekly_hours: "1 hr",
          monthly_hours: "~4 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Automate accounts receivable follow-up: past-due accounts trigger reminders to the right people automatically.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Past-Due Accounts", value: "3", subtitle: "Currently overdue" },
              { label: "Total AR Overdue", value: "$48,200", subtitle: "Past net terms" },
              { label: "Peter's AR Time", value: "1 hr/wk", subtitle: "Manual follow-up" },
              { label: "Avg Collection Lag", value: "18 days", subtitle: "Past due date" }
            ],
            summary: "Three accounts are currently past due totaling $48,200, with an average collection lag of 18 days past the due date. Peter spends approximately 1 hour per week reviewing the bi-weekly AR report and manually emailing Oswin and sales reps to initiate follow-up. This is a process that should require zero C-Suite time and will scale with the growing merchant base.",
            charts: [
              {
                id: "csuite-ar-aging-buckets",
                title: "AR Aging Breakdown ($K)",
                type: "bar",
                data: {
                  labels: ["Current", "1-30 Days", "31-60 Days", "61-90 Days", ">90 Days"],
                  datasets: [
                    { label: "Outstanding ($K)", data: [125,42,28,14,6.2] }
                  ]
                }
              },
              {
                id: "csuite-ar-overdue-trend",
                title: "Past-Due Account Count",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Past-Due Accounts", data: [4,4,3,3,4,3,2,3,3,4,3,3,2,3,4,3,3,2,3,3,3,3] }
                  ]
                }
              },
              {
                id: "csuite-ar-collection-time",
                title: "Avg Days to Collect (Past Due)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Avg Days to Collect", data: [22,20,19,21,18,20,17,19,21,18,20,16,19,22,18,17,20,16,18,19,17,18] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Customer", "Invoice #", "Amount", "Due Date", "Days Overdue", "Owner", "Last Follow-Up", "Status"],
              rows: [
                ["Metro Refreshments", "INV-8842", "$18,400.00", "Mar 15", "23", "Oswin", "Apr 3", "Follow-Up Sent"],
                ["CityWide Snacks", "INV-8835", "$12,600.00", "Mar 20", "18", "Tyler", "Apr 2", "Follow-Up Sent"],
                ["Lakefront Markets", "INV-8830", "$17,200.00", "Mar 22", "16", "Rob D.", "Apr 1", "Promise to Pay"],
                ["Summit Food Services", "INV-8910", "$8,500.00", "Apr 1", "6", "Oswin", "None", "New"],
                ["Evergreen Markets", "INV-8895", "$5,200.00", "Mar 28", "10", "Tyler", "Apr 4", "Follow-Up Sent"],
                ["Sunrise Vending Co", "INV-8820", "$22,100.00", "Mar 10", "28", "Peter", "Mar 31", "Escalated"]
              ],
              badges: {
                7: { "Follow-Up Sent": "warning", "Promise to Pay": "info", "New": "neutral", "Escalated": "danger", "Paid": "success" }
              }
            }
          }
        },
        {
          rank: 9,
          name: "Meeting Action Item Tracking",
          slug: "meeting-action-item-tracking",
          status: "Not Started",
          who: "Peter",
          weekly_hours: "1 hr",
          monthly_hours: "~4 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Capture meeting notes, extract action items, assign owners, and track completion automatically.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Weekly Meetings", value: "3", subtitle: "Management, strategic, sales" },
              { label: "Action Items/Week", value: "18", subtitle: "Avg across all meetings" },
              { label: "Completion Rate", value: "61%", subtitle: "Items completed on time" },
              { label: "Tracking Method", value: "Notebook", subtitle: "Peter's personal notes" }
            ],
            summary: "Across 3 weekly recurring meetings, approximately 18 action items are generated per week with only a 61% on-time completion rate. All tracking currently lives in Peter's personal notebook with no shared visibility or automated reminders. Items that slip between meetings represent a growing risk as the number of concurrent initiatives increases with company scale.",
            charts: [
              {
                id: "csuite-action-items-trend",
                title: "Weekly Action Items: Created vs Completed",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Created", data: [5,3,4,2,4,6,3,4,2,3,5,4,3,2,4,5,3,4,2,4,6,3] },
                    { label: "Completed", data: [3,2,3,1,2,4,2,3,1,2,3,2,2,1,3,3,2,3,1,2,4,2] }
                  ]
                }
              },
              {
                id: "csuite-action-items-by-owner",
                title: "Open Action Items by Owner",
                type: "horizontal-bar",
                data: {
                  labels: ["Peter", "Chris", "Oswin", "Scott", "Richard", "Layal", "Rob M.", "Other"],
                  datasets: [
                    { label: "Open Items", data: [5,4,3,3,2,2,1,2] }
                  ]
                }
              },
              {
                id: "csuite-action-completion-rate",
                title: "Weekly Completion Rate (%)",
                type: "line",
                data: {
                  labels: ["W1 Feb","W2 Feb","W3 Feb","W4 Feb","W1 Mar","W2 Mar","W3 Mar","W4 Mar","W1 Apr"],
                  datasets: [
                    { label: "Completion Rate %", data: [58,65,55,62,68,57,64,60,61] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Action Item", "Owner", "Meeting", "Created", "Due", "Age (days)", "Status"],
              rows: [
                ["Review WeVend distributor pricing tier", "Peter", "Strategic", "Apr 6", "Apr 10", "1", "Open"],
                ["Send updated terminal specs to National Vending", "Oswin", "Sales Call", "Apr 3", "Apr 7", "4", "Open"],
                ["Finalize Q2 hiring plan", "Chris", "Management", "Mar 31", "Apr 7", "7", "Overdue"],
                ["Schedule Phorge bulk closure demo with IT", "Scott", "Management", "Mar 31", "Apr 4", "7", "Complete"],
                ["Provide AR aging report to Peter", "Nancy", "Management", "Mar 27", "Mar 31", "11", "Complete"],
                ["Draft commission platform requirements", "Richard", "Strategic", "Mar 24", "Apr 4", "14", "Overdue"],
                ["Review smart cooler hardware specs", "Chris", "Management", "Mar 24", "Mar 31", "14", "Complete"],
                ["Send trade show client list to Peter", "Oswin", "Sales Call", "Mar 20", "Mar 24", "18", "Complete"],
                ["Update WeSell CRM pipeline view", "Layal", "Management", "Mar 17", "Mar 28", "21", "Overdue"],
                ["Evaluate ApprovalMax for invoice workflow", "Scott", "Management", "Mar 10", "Mar 24", "28", "Open"]
              ],
              badges: {
                6: { "Open": "warning", "Complete": "success", "Overdue": "danger", "Cancelled": "neutral" }
              }
            }
          }
        }
      ],
    },

    // === ENGINEERING ===
    {
      name: "Engineering",
      slug: "engineering",
      priorities: [
        {
          rank: 1,
          name: "Requirements Gate + PRD Automation",
          slug: "requirements-gate-prd-automation",
          status: "Not Started",
          who: "Richard, devs, PM, Product",
          weekly_hours: "~20 hrs",
          monthly_hours: "~80 hrs",
          complexity: "Medium",
          impact: "High",
          description: "AI-assisted requirements intake and PRD generation that structures, validates, and stress-tests requirements before development begins.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Monthly Projects", value: "2", subtitle: "Requiring full requirements" },
              { label: "Mid-Flight Changes", value: "95%", subtitle: "Projects with scope additions" },
              { label: "Avg Timeline Extension", value: "28%", subtitle: "Due to requirement gaps" },
              { label: "Rework Hours/Project", value: "27.5", subtitle: "From incomplete PRDs" }
            ],
            summary: "Requirements quality remains the department's primary challenge, with 95% of projects experiencing mid-flight scope additions that cause an average 28% timeline extension. Each of the 2 monthly full-requirements projects generates approximately 27.5 hours of rework from incomplete PRDs. Claude-assisted PRD generation is already in early use, and formalizing the requirements gate is expected to reduce mid-flight additions to under 30%.",
            charts: [
              {
                id: "eng-prd-completeness",
                title: "PRD Completeness Score at Dev Start (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Completeness %", data: [52,55,48,58,54,60,53,57,61,55,59,63,56,62,58,65,60,64,57,62,66,63] },
                    { label: "Target (90%)", data: [90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90] }
                  ]
                }
              },
              {
                id: "eng-prd-rework-hours",
                title: "Rework Hours per Project",
                type: "bar",
                data: {
                  labels: ["Payment Gateway v2", "Mobile Refresh", "Smart Cooler", "Bulk Vending", "CI/CD Pipeline", "WeTrack Upgrade"],
                  datasets: [
                    { label: "Rework Hours", data: [22,30,35,25,18,28] }
                  ]
                }
              },
              {
                id: "eng-prd-timeline-impact",
                title: "Timeline Extension by Project (%)",
                type: "horizontal-bar",
                data: {
                  labels: ["Payment Gateway v2", "Mobile Refresh", "Smart Cooler", "Bulk Vending", "CI/CD Pipeline", "WeTrack Upgrade"],
                  datasets: [
                    { label: "Extension %", data: [15,25,35,22,18,30] }
                  ]
                }
              },
              {
                id: "eng-prd-scope-changes",
                title: "Mid-Flight Scope Changes per Sprint",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Scope Changes", data: [3,2,4,1,3,2,4,3,2,1,3,2,4,1,2,3,1,2,3,2,1,2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Project", "PRD Score", "Scope Changes", "Rework (hrs)", "Extension", "Gate Status", "Status"],
              rows: [
                ["Payment Gateway v2", "78%", "3", "22", "15%", "Passed", "In Dev"],
                ["Mobile App Refresh", "62%", "5", "30", "25%", "Bypassed", "In Dev"],
                ["Smart Cooler Features", "55%", "7", "35", "35%", "Bypassed", "In Dev"],
                ["Bulk Vending Launch", "68%", "4", "25", "22%", "Partial", "In Dev"],
                ["CI/CD Pipeline", "72%", "2", "18", "18%", "Passed", "In Dev"],
                ["WeTrack Upgrade", "58%", "6", "28", "30%", "Bypassed", "Planning"],
                ["Commission Platform", "45%", "N/A", "N/A", "N/A", "Not Started", "Requirements"],
                ["CRM Enhancement", "35%", "N/A", "N/A", "N/A", "Not Started", "Scoping"]
              ],
              badges: {
                5: { "Passed": "success", "Partial": "warning", "Bypassed": "danger", "Not Started": "neutral" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Support Ticket Triage Agent",
          slug: "support-ticket-triage-agent",
          status: "Not Started",
          who: "James, Gavin",
          weekly_hours: "~17.5 hrs",
          monthly_hours: "~70 hrs",
          complexity: "Medium",
          impact: "High",
          description: "AI triage agent that classifies incoming Jira tickets, pulls logs, and resolves or routes with full context before a developer touches it.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Weekly Tickets", value: "13", subtitle: "Avg incoming via JSM" },
              { label: "Non-Bug Rate", value: "62%", subtitle: "Config/hardware/user error" },
              { label: "Triage Time/Ticket", value: "2.4 hrs", subtitle: "Senior dev investigation" },
              { label: "Dev Hours Wasted", value: "19.3 hrs/wk", subtitle: "On non-bug tickets" }
            ],
            summary: "The support ticket pipeline averages 13 incoming tickets per week with 62% turning out to be non-bug issues (config, hardware, user error, or third-party problems). James and Gavin spend approximately 2.4 hours per ticket on investigation, wasting 19.3 hours per week of senior engineering time on non-bug triage. An AI triage agent targeting 80% automated classification would recover the majority of this time.",
            charts: [
              {
                id: "eng-ticket-volume",
                title: "Daily Ticket Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Bug", data: [1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0] },
                    { label: "Non-Bug", data: [2,1,2,1,2,1,2,1,2,1,2,1,2,2,1,2,1,2,1,2,1,2] }
                  ]
                }
              },
              {
                id: "eng-ticket-classification",
                title: "Ticket Classification Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Actual Bug", "Config Issue", "Third-Party", "Hardware", "User Error", "Feature Gap"],
                  datasets: [
                    { data: [38,22,15,10,8,7] }
                  ]
                }
              },
              {
                id: "eng-ticket-resolution-time",
                title: "Avg Resolution Time by Type (hrs)",
                type: "bar",
                data: {
                  labels: ["Actual Bug", "Config Issue", "Third-Party", "Hardware", "User Error", "Feature Gap"],
                  datasets: [
                    { label: "Investigation (hrs)", data: [4.2,2.8,2.1,1.5,1.2,2.5] },
                    { label: "Resolution (hrs)", data: [8.5,1.2,0.5,0.3,0.5,0] }
                  ]
                }
              },
              {
                id: "eng-ticket-dev-time-wasted",
                title: "Weekly Dev Hours on Non-Bug Triage",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "James (hrs)", data: [2.5,1.8,3.2,2.0,2.8,1.5,3.0,2.2,2.6,1.9,2.8,2.1,3.1,1.7,2.4,2.9,1.6,2.7,2.3,1.8,3.0,2.2] },
                    { label: "Gavin (hrs)", data: [1.8,2.2,1.5,2.8,1.6,2.4,1.9,2.5,1.7,2.3,1.8,2.6,1.4,2.8,1.9,2.1,2.5,1.6,2.4,2.0,1.7,2.8] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Ticket #", "Summary", "Platform", "Assigned To", "Classification", "Investigation (hrs)", "Resolution", "Status"],
              rows: [
                ["JSM-1847", "Payment timeout on terminal T-442", "Android", "Gavin", "Third-Party", "2.5", "Processor outage", "Resolved"],
                ["JSM-1846", "Dashboard not loading for merchant", "Web", "James", "Config Issue", "1.8", "Cache cleared", "Resolved"],
                ["JSM-1845", "Receipt not printing after update", "Android", "Gavin", "Hardware", "1.2", "Printer firmware", "Resolved"],
                ["JSM-1844", "API 500 error on transaction submit", "Web", "James", "Actual Bug", "3.5", "Fix deployed", "Resolved"],
                ["JSM-1843", "Cannot log into merchant portal", "Web", "James", "User Error", "0.8", "Password reset", "Resolved"],
                ["JSM-1842", "Slow transaction processing", "Android", "Gavin", "Third-Party", "2.2", "Network latency", "Resolved"],
                ["JSM-1841", "Report data showing wrong dates", "Web", "James", "Actual Bug", "4.0", "In progress", "Open"],
                ["JSM-1840", "Terminal offline intermittently", "Android", "Gavin", "Hardware", "1.5", "Replaced unit", "Resolved"],
                ["JSM-1839", "Feature request: bulk refund", "Web", "James", "Feature Gap", "2.0", "Backlogged", "Closed"]
              ],
              badges: {
                4: { "Actual Bug": "danger", "Config Issue": "warning", "Third-Party": "info", "Hardware": "neutral", "User Error": "neutral", "Feature Gap": "info" },
                7: { "Resolved": "success", "Open": "warning", "Closed": "neutral" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "QA Automation + Release Docs",
          slug: "qa-automation-release-docs",
          status: "Not Started",
          who: "Yuchen",
          weekly_hours: "~8.5 hrs",
          monthly_hours: "~34 hrs",
          complexity: "Medium-High",
          impact: "Medium",
          description: "Automate web app test execution and AI-generate release documentation from Jira ticket data.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Yuchen's Weekly Testing", value: "30 hrs", subtitle: "50% web / 50% Android" },
              { label: "Releases/Month", value: "7", subtitle: "Avg deployment cadence" },
              { label: "Doc Time/Release", value: "1 hr", subtitle: "Release notes + Confluence" },
              { label: "Web Test Automation", value: "0%", subtitle: "Currently all manual" }
            ],
            summary: "Yuchen dedicates 30 hours per week to active testing split evenly between web app and Android terminal testing. With 7 releases per month and 1 hour of documentation per release, the documentation burden alone accounts for 7 hours monthly. Web app test automation at 0% represents a clear opportunity to free 7.5 hours per week for higher-value Android and integration testing work.",
            charts: [
              {
                id: "eng-qa-test-coverage",
                title: "Test Coverage by Platform (%)",
                type: "stacked-bar",
                data: {
                  labels: ["Jan","Feb","Mar","Apr (target)"],
                  datasets: [
                    { label: "Web - Automated", data: [0,0,0,25] },
                    { label: "Web - Manual", data: [100,100,100,75] },
                    { label: "Android - Manual (required)", data: [100,100,100,100] }
                  ]
                }
              },
              {
                id: "eng-qa-release-cadence",
                title: "Monthly Releases and Test Pass Rate",
                type: "multi-line",
                data: {
                  labels: ["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],
                  datasets: [
                    { label: "Releases", data: [5,6,4,7,8,7] },
                    { label: "Test Pass Rate %", data: [92,89,94,91,88,93] }
                  ]
                }
              },
              {
                id: "eng-qa-time-allocation",
                title: "Yuchen's Weekly Time Allocation (hrs)",
                type: "doughnut",
                data: {
                  labels: ["Web App Testing", "Android Testing", "Release Docs", "Test Case Development", "Other"],
                  datasets: [
                    { data: [15,15,1.75,6,2.25] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Release", "Version", "Date", "Tickets", "Tests Run", "Pass Rate", "Doc Time", "Status"],
              rows: [
                ["R-2026-028", "v3.14.2", "Apr 4", "8", "142", "96%", "55 min", "Released"],
                ["R-2026-027", "v3.14.1", "Mar 28", "5", "138", "94%", "48 min", "Released"],
                ["R-2026-026", "v3.14.0", "Mar 21", "12", "165", "91%", "72 min", "Released"],
                ["R-2026-025", "v3.13.4", "Mar 14", "4", "130", "98%", "35 min", "Released"],
                ["R-2026-024", "v3.13.3", "Mar 7", "6", "145", "93%", "52 min", "Released"],
                ["R-2026-023", "v3.13.2", "Feb 28", "9", "158", "89%", "65 min", "Released"],
                ["R-2026-022", "v3.13.1", "Feb 21", "3", "125", "97%", "30 min", "Released"],
                ["R-2026-029", "v3.15.0", "Apr 11", "15", "0", "N/A", "N/A", "In QA"]
              ],
              badges: {
                7: { "Released": "success", "In QA": "warning", "Failed": "danger", "Staged": "info" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Metrics + Reporting Dashboards",
          slug: "metrics-reporting-dashboards",
          status: "Not Started",
          who: "Richard",
          weekly_hours: "~3.25 hrs",
          monthly_hours: "~13 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Self-serve dashboard for leadership with deploy frequency, bug rate, ROI metrics, and staff attendance.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Deploy Frequency", value: "2.4/wk", subtitle: "Current avg" },
              { label: "Bug Rate/Release", value: "1.8", subtitle: "Post-deploy bugs" },
              { label: "Richard's Report Time", value: "3.25 hrs/wk", subtitle: "Manual compilation" },
              { label: "Ad-Hoc Requests", value: "5/mo", subtitle: "Leadership report asks" }
            ],
            summary: "The engineering department deploys 2.4 times per week with an average of 1.8 post-deploy bugs per release. Richard spends 3.25 hours per week manually compiling reports for approximately 5 monthly ad-hoc leadership requests. Self-serve dashboards pulling from Jira and GitHub APIs would reduce Richard's reporting time by 90% while giving leadership real-time access to the metrics they need.",
            charts: [
              {
                id: "eng-deploy-frequency",
                title: "Weekly Deploy Frequency",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Deployments", data: [1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0] }
                  ]
                }
              },
              {
                id: "eng-bug-rate-per-release",
                title: "Bugs per Release",
                type: "line",
                data: {
                  labels: ["R-020","R-021","R-022","R-023","R-024","R-025","R-026","R-027","R-028"],
                  datasets: [
                    { label: "Post-Deploy Bugs", data: [2,1,3,1,2,1,3,2,1] },
                    { label: "Critical Bugs", data: [0,0,1,0,1,0,1,0,0] }
                  ]
                }
              },
              {
                id: "eng-sprint-velocity",
                title: "Sprint Velocity (Story Points)",
                type: "line",
                data: {
                  labels: ["Sprint 18","Sprint 19","Sprint 20","Sprint 21","Sprint 22","Sprint 23","Sprint 24","Sprint 25"],
                  datasets: [
                    { label: "Committed", data: [38,40,42,36,40,38,42,40] },
                    { label: "Completed", data: [34,36,38,32,37,35,39,36] }
                  ]
                }
              },
              {
                id: "eng-deploy-to-bug-ratio",
                title: "Deploy-to-Bug Ratio (Lower is Better)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Ratio", data: [2.0,1.8,2.2,1.6,1.9,1.7,2.1,1.5,1.8,2.0,1.6,1.9,2.1,1.7,1.8,1.5,2.0,1.6,1.9,1.7,1.8,1.5] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Metric", "Current Value", "Target", "Trend", "Data Source", "Status"],
              rows: [
                ["Deploy Frequency (weekly)", "2.4", "5.0", "Up", "GitHub", "Behind"],
                ["Bug Rate per Release", "1.8", "<1.0", "Flat", "Jira", "Behind"],
                ["Sprint Velocity (pts)", "36", "40", "Up", "Jira", "Improving"],
                ["Code Review Turnaround (hrs)", "8.2", "<4", "Down", "GitHub", "Improving"],
                ["Build Success Rate", "94%", ">98%", "Up", "CI/CD", "Behind"],
                ["Staff Attendance Rate", "96%", ">95%", "Flat", "Manual", "On Track"],
                ["Mean Time to Recovery (hrs)", "2.1", "<1", "Down", "AWS/Jira", "Improving"],
                ["AI Tool ROI (hrs saved/wk)", "4.5", "10", "Up", "Manual", "On Track"]
              ],
              badges: {
                5: { "On Track": "success", "Behind": "warning", "Improving": "info", "At Risk": "danger" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Production Monitoring Dashboards",
          slug: "production-monitoring-dashboards",
          status: "Not Started",
          who: "Dev team, Support team",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Proactive monitoring of production environments with automated alerts before customers experience issues.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Weekly Env Tickets", value: "3.5", subtitle: "Customer-reported avg" },
              { label: "Proactive Detection", value: "0%", subtitle: "All issues customer-reported" },
              { label: "Avg Cycle Time", value: "15 min", subtitle: "Report to resolution" },
              { label: "Target Detection", value: "80%", subtitle: "Before customer reports" }
            ],
            summary: "Production environments currently generate an average of 3.5 customer-reported infrastructure tickets per week with 0% proactive detection - every single issue is discovered when a customer reports it. The average 15-minute cycle time from report to resolution confirms that investigations themselves are fast (3-5 minutes), but the lack of proactive monitoring means customers experience the full outage duration. AWS CloudWatch monitoring targeting 80% early detection would significantly improve customer experience.",
            charts: [
              {
                id: "eng-prod-incidents",
                title: "Daily Infrastructure Incidents",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Customer-Reported", data: [1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1] },
                    { label: "Proactive (target)", data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] }
                  ]
                }
              },
              {
                id: "eng-prod-incident-types",
                title: "Incident Type Distribution",
                type: "doughnut",
                data: {
                  labels: ["API Errors", "Service Downtime", "Latency Spikes", "DB Connection", "DNS/Network"],
                  datasets: [
                    { data: [30,25,20,15,10] }
                  ]
                }
              },
              {
                id: "eng-prod-resolution-time",
                title: "Time to Resolution (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Resolution Time (min)", data: [12,18,8,15,22,10,14,20,9,16,11,19,13,17,8,14,21,10,15,12,18,13] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Incident", "Type", "Service", "Reported By", "Detection", "Duration (min)", "Impact", "Status"],
              rows: [
                ["INC-0892", "API Error", "Payment API", "Merchant", "Customer", "12", "3 terminals", "Resolved"],
                ["INC-0891", "Latency Spike", "Transaction Engine", "Merchant", "Customer", "18", "Slow processing", "Resolved"],
                ["INC-0890", "Service Down", "Merchant Portal", "Support", "Customer", "8", "Portal unavailable", "Resolved"],
                ["INC-0889", "DB Connection", "Reporting DB", "Merchant", "Customer", "22", "Reports failed", "Resolved"],
                ["INC-0888", "API Error", "Onboarding API", "Sales Ops", "Customer", "10", "App submission", "Resolved"],
                ["INC-0887", "DNS/Network", "CDN", "Multiple", "Customer", "25", "Asset loading", "Resolved"],
                ["INC-0886", "Latency Spike", "Payment API", "Merchant", "Customer", "15", "2 terminals", "Resolved"],
                ["INC-0885", "Service Down", "Admin Dashboard", "Internal", "Customer", "5", "Internal only", "Resolved"]
              ],
              badges: {
                4: { "Customer": "danger", "Proactive": "success", "Internal": "info" },
                7: { "Resolved": "success", "Open": "warning", "Investigating": "info" }
              }
            }
          }
        }
      ],
    },

    // === HUMAN RESOURCES ===
    {
      name: "Human Resources",
      slug: "human-resources",
      priorities: [
        {
          rank: 1,
          name: "AI-Assisted Resume Screening",
          slug: "ai-assisted-resume-screening",
          status: "Not Started",
          who: "Rob Maynard",
          weekly_hours: "~5 hrs",
          monthly_hours: "~20 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Use AI to pre-screen incoming resumes and surface a ranked shortlist, eliminating manual review of every application.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Weekly Resume Volume", value: "~600", subtitle: "Across 3 active postings" },
              { label: "Manual Review Time", value: "~10 hrs/wk", subtitle: "Before automation" },
              { label: "Avg Time per Resume", value: "45 sec", subtitle: "Range: 5s to 2min" },
              { label: "Shortlist Conversion", value: "8.3%", subtitle: "~50 viable per cycle" }
            ],
            summary: "Resume screening currently consumes approximately 10 hours per week across 3 active postings averaging 200 resumes each. The 8.3% shortlist conversion rate indicates significant time spent on unqualified applicants. AI-assisted screening is projected to reduce manual review time by 50%, saving roughly 5 hours per week while maintaining candidate quality.",
            charts: [
              {
                id: "hr-resume-volume",
                title: "Daily Resume Submissions",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Resumes Received", data: [32,28,35,41,22,38,30,44,27,33,36,29,42,31,25,37,34,40,28,35,39,31] }
                  ]
                }
              },
              {
                id: "hr-review-time-daily",
                title: "Daily Manual Review Time (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Review Time (hrs)", data: [1.8,1.5,2.1,2.4,1.2,2.0,1.7,2.5,1.4,1.9,2.1,1.6,2.3,1.8,1.3,2.0,1.9,2.2,1.5,2.0,2.1,1.7] }
                  ]
                }
              },
              {
                id: "hr-resume-quality-breakdown",
                title: "Resume Quality Distribution",
                type: "doughnut",
                data: {
                  labels: ["Unqualified", "Borderline", "Qualified", "Strong Match"],
                  datasets: [
                    { data: [52, 28, 14, 6] }
                  ]
                }
              },
              {
                id: "hr-shortlist-rate",
                title: "Weekly Shortlist Conversion Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Conversion %", data: [7.8,8.1,9.2,7.5,8.8,8.3,7.9,9.5,8.0,8.6,7.4,8.9,8.2,7.7,9.1,8.5,8.0,7.6,8.8,8.3,9.0,8.1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Posting", "Department", "Resumes", "Shortlisted", "Conversion %", "Avg Review (sec)", "Status"],
              rows: [
                ["Warehouse Associate", "Operations", "214", "18", "8.4%", "38", "Active"],
                ["Field Technician", "Operations", "187", "15", "8.0%", "42", "Active"],
                ["Sales Rep - MONEX", "Sales", "198", "17", "8.6%", "51", "Active"],
                ["Accounting Clerk", "Accounting", "156", "14", "9.0%", "35", "Closed"],
                ["IT Support Analyst", "IT", "143", "11", "7.7%", "48", "Closed"],
                ["Marketing Coordinator", "Marketing", "172", "16", "9.3%", "40", "Closed"],
                ["Customer Service Rep", "Operations", "225", "19", "8.4%", "36", "Closed"],
                ["Logistics Coordinator", "Operations", "134", "10", "7.5%", "44", "Closed"]
              ],
              badges: {
                6: { "Active": "success", "Closed": "neutral", "On Hold": "warning" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Digital Onboarding Document Portal",
          slug: "digital-onboarding-document-portal",
          status: "Not Started",
          who: "Rob Maynard",
          weekly_hours: "~22 min",
          monthly_hours: "~88 min",
          complexity: "Low",
          impact: "Medium",
          description: "Replace email-based document collection with a digital intake form with automatic tracking of submissions.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Avg Hires/Month", value: "2.5", subtitle: "Mix of CA and US" },
              { label: "Time per Hire", value: "~1 hr", subtitle: "Document collection" },
              { label: "Completion Rate", value: "72%", subtitle: "Before day-one start" },
              { label: "Follow-up Emails", value: "4.2/hire", subtitle: "Avg chasing docs" }
            ],
            summary: "Onboarding document collection currently takes approximately 1 hour per hire with an average of 4.2 follow-up emails needed to obtain complete submissions. Only 72% of new hires have all documents submitted before their start date, creating day-one administrative burden. A digital portal with automatic reminders could reduce follow-up effort by 50% and improve pre-start completion rates.",
            charts: [
              {
                id: "hr-onboarding-completion",
                title: "Document Completion Rate by Week (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Completion %", data: [68,70,72,71,74,69,73,75,70,72,76,71,74,68,73,75,72,70,77,73,71,74] }
                  ]
                }
              },
              {
                id: "hr-onboarding-followups",
                title: "Follow-up Emails per Hire",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Follow-ups", data: [5,3,4,6,3,5,4,3,5,4,3,5,4,6,3,4,5,3,4,5,3,4] }
                  ]
                }
              },
              {
                id: "hr-onboarding-doc-types",
                title: "Missing Document Types",
                type: "doughnut",
                data: {
                  labels: ["Tax Forms", "ID/Photo", "Banking Info", "Emergency Contact", "Policy Ack."],
                  datasets: [
                    { data: [28, 22, 19, 18, 13] }
                  ]
                }
              }
            ],
            table: {
              columns: ["New Hire", "Type", "Start Date", "Docs Submitted", "Docs Required", "Completion", "Status"],
              rows: [
                ["M. Thompson", "CA Employee", "Apr 14", "5", "8", "63%", "Incomplete"],
                ["J. Rivera", "US Contractor", "Apr 7", "6", "6", "100%", "Complete"],
                ["S. Chen", "CA Employee", "Mar 31", "7", "8", "88%", "Incomplete"],
                ["A. Dubois", "CA Employee", "Mar 24", "8", "8", "100%", "Complete"],
                ["K. Patel", "US Contractor", "Mar 17", "6", "6", "100%", "Complete"],
                ["R. Nguyen", "CA Employee", "Mar 10", "6", "8", "75%", "Incomplete"],
                ["T. Williams", "US Contractor", "Mar 3", "5", "6", "83%", "Incomplete"],
                ["L. Morrison", "CA Employee", "Feb 24", "8", "8", "100%", "Complete"]
              ],
              badges: {
                6: { "Complete": "success", "Incomplete": "warning", "Overdue": "danger" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "E-Signature for Offer Letters",
          slug: "e-signature-for-offer-letters",
          status: "Not Started",
          who: "Rob Maynard",
          weekly_hours: "~15 min",
          monthly_hours: "~60 min",
          complexity: "Low",
          impact: "Medium",
          description: "Replace the print-sign-scan-email process for offer letters with a digital e-signature tool.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Avg Turnaround", value: "36 hrs", subtitle: "Print-sign-scan cycle" },
              { label: "Offers/Month", value: "2.5", subtitle: "Across all roles" },
              { label: "Delayed Signatures", value: "40%", subtitle: "Exceed 48hr window" },
              { label: "Time per Offer", value: "~45 min", subtitle: "Logistics overhead" }
            ],
            summary: "The current print-sign-scan workflow averages 36 hours for offer letter turnaround, with 40% of candidates exceeding the 48-hour window. At 2.5 offers per month, Rob spends approximately 45 minutes per offer on logistics alone. E-signature adoption could cut turnaround to under 4 hours and reduce per-offer administrative time by 60%.",
            charts: [
              {
                id: "hr-esign-turnaround",
                title: "Offer Letter Turnaround Time (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Turnaround (hrs)", data: [28,42,35,24,48,32,38,52,30,44,26,40,34,56,28,36,42,30,46,32,38,34] }
                  ]
                }
              },
              {
                id: "hr-esign-method",
                title: "Signature Method Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Print-Sign-Scan", "Photo of Signed", "In-Person", "Digital (Informal)"],
                  datasets: [
                    { data: [45, 25, 20, 10] }
                  ]
                }
              },
              {
                id: "hr-esign-delay-rate",
                title: "Offers Exceeding 48hr Window (%)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Delayed %", data: [33,50,40,25,50,33,42,58,30,45,25,42,35,55,28,38,45,30,48,33,40,35] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Candidate", "Role", "Offer Sent", "Signed", "Turnaround", "Method", "Status"],
              rows: [
                ["D. Martinez", "Warehouse Associate", "Apr 4", "Apr 5", "22 hrs", "Photo", "Accepted"],
                ["P. Wilson", "Field Tech", "Mar 28", "Mar 30", "52 hrs", "Print-Scan", "Accepted"],
                ["J. Brown", "Sales Rep", "Mar 25", "Mar 26", "18 hrs", "In-Person", "Accepted"],
                ["M. Lee", "IT Support", "Mar 20", "Mar 23", "68 hrs", "Print-Scan", "Accepted"],
                ["R. Garcia", "Accounting Clerk", "Mar 14", "Mar 15", "24 hrs", "Photo", "Accepted"],
                ["A. Singh", "Customer Service", "Mar 10", "Mar 12", "44 hrs", "Print-Scan", "Declined"],
                ["T. Nakamura", "Logistics Coord.", "Mar 5", "Mar 6", "16 hrs", "In-Person", "Accepted"],
                ["K. O'Brien", "Marketing Asst.", "Feb 28", "Mar 3", "72 hrs", "Print-Scan", "Accepted"]
              ],
              badges: {
                6: { "Accepted": "success", "Declined": "danger", "Pending": "warning" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Standardized Payroll Hours Submission",
          slug: "standardized-payroll-hours-submission",
          status: "Not Started",
          who: "Rob Maynard",
          weekly_hours: "~15 min",
          monthly_hours: "~60 min",
          complexity: "Low",
          impact: "Medium",
          description: "Replace ad hoc manager submission process with a standardized form for payroll hours.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Pay Periods/Month", value: "2", subtitle: "Semi-monthly cycle" },
              { label: "Time per Period", value: "~1 hr", subtitle: "Reconcile + entry" },
              { label: "Submission Formats", value: "4+", subtitle: "No standard format" },
              { label: "Error Rate", value: "5.8%", subtitle: "Reconciliation errors" }
            ],
            summary: "Payroll hours reconciliation takes approximately 1 hour per pay period across 4 or more different submission formats from managers. The 5.8% error rate stems from inconsistent formatting and missing fields, requiring additional correction cycles with Accounting. Standardizing to a single form would reduce reconciliation time by 50% and cut errors by an estimated 75%.",
            charts: [
              {
                id: "hr-payroll-reconcile-time",
                title: "Reconciliation Time per Pay Period (min)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Reconciliation (min)", data: [0,0,0,0,55,0,0,0,0,0,0,0,62,0,0,0,0,0,0,58,0,0] }
                  ]
                }
              },
              {
                id: "hr-payroll-error-trend",
                title: "Payroll Error Rate by Period (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Error %", data: [5.2,5.4,5.8,5.6,6.1,5.3,5.7,6.0,5.5,5.9,5.1,5.6,6.2,5.4,5.8,5.2,5.5,5.9,5.3,5.7,5.0,5.4] }
                  ]
                }
              },
              {
                id: "hr-payroll-submission-methods",
                title: "Manager Submission Methods",
                type: "doughnut",
                data: {
                  labels: ["Compiled Email List", "CC'd Approval Emails", "Verbal/In-Person", "Spreadsheet Attachment"],
                  datasets: [
                    { data: [35, 30, 20, 15] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Manager", "Department", "Employees", "Format", "On-Time", "Errors", "Status"],
              rows: [
                ["S. Thompson", "Operations", "12", "Email List", "Yes", "1", "Processed"],
                ["J. Zhu", "IT", "3", "Spreadsheet", "Yes", "0", "Processed"],
                ["D. Flores", "Marketing", "4", "CC'd Emails", "No", "2", "Corrections"],
                ["R. Dubois", "Sales - WeVend", "8", "Email List", "Yes", "0", "Processed"],
                ["T. Patel", "Sales - MONEX", "6", "Verbal", "No", "3", "Corrections"],
                ["A. Nguyen", "Accounting", "3", "Spreadsheet", "Yes", "0", "Processed"],
                ["M. Chen", "Warehouse", "9", "CC'd Emails", "Yes", "1", "Processed"],
                ["K. Reza", "Infrastructure", "2", "Email List", "Yes", "0", "Processed"]
              ],
              badges: {
                6: { "Processed": "success", "Corrections": "warning", "Missing": "danger" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Automated Manager Follow-Up (Hiring)",
          slug: "automated-manager-follow-up-hiring",
          status: "Not Started",
          who: "Rob Maynard",
          weekly_hours: "~20 min",
          monthly_hours: "~80 min",
          complexity: "Low",
          impact: "Medium",
          description: "Auto-trigger reminders if a manager hasn't responded to a candidate shortlist within 48 hours.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Avg Response Time", value: "3.8 days", subtitle: "Manager shortlist review" },
              { label: "Within 48hrs", value: "35%", subtitle: "Meet informal SLA" },
              { label: "Follow-up Time", value: "~30 min/wk", subtitle: "Manual chasing" },
              { label: "Open Roles Delayed", value: "2.1", subtitle: "Avg roles waiting on mgr" }
            ],
            summary: "Manager response to candidate shortlists averages 3.8 days, with only 35% meeting the informal 48-hour window. Rob spends approximately 30 minutes per week on manual follow-ups, but the downstream impact of 2.1 open roles sitting idle is the larger organizational cost. Automated reminders with escalation could improve the 48-hour compliance rate to over 70%.",
            charts: [
              {
                id: "hr-mgr-response-time",
                title: "Manager Response Time (days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Response (days)", data: [4.2,3.5,2.8,5.1,3.0,4.5,2.1,3.8,4.0,2.5,3.9,4.8,3.2,2.0,5.3,3.6,4.1,2.9,3.7,4.4,2.3,3.8] }
                  ]
                }
              },
              {
                id: "hr-mgr-sla-compliance",
                title: "48hr SLA Compliance Rate (%)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Within 48hrs %", data: [30,40,50,20,45,25,55,35,30,50,32,22,42,60,18,38,28,48,35,25,52,35] }
                  ]
                }
              },
              {
                id: "hr-mgr-open-roles",
                title: "Open Roles Waiting on Manager Review",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Roles Waiting", data: [2,3,2,3,1,2,3,2,3,1,2,3,2,1,3,2,2,3,2,3,1,2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Shortlist", "Manager", "Sent", "Responded", "Response Time", "Candidates", "Status"],
              rows: [
                ["Warehouse Associate", "S. Thompson", "Apr 3", "Apr 7", "4.0 days", "5", "Reviewed"],
                ["Field Technician", "M. Chen", "Apr 1", "Pending", "6+ days", "4", "Overdue"],
                ["Sales Rep - MONEX", "T. Patel", "Mar 28", "Mar 29", "1.2 days", "6", "Reviewed"],
                ["IT Support", "J. Zhu", "Mar 25", "Mar 26", "0.8 days", "3", "Reviewed"],
                ["Customer Service", "S. Thompson", "Mar 20", "Mar 25", "5.0 days", "5", "Reviewed"],
                ["Logistics Coord.", "M. Chen", "Mar 17", "Mar 21", "4.2 days", "4", "Reviewed"],
                ["Marketing Asst.", "D. Flores", "Mar 12", "Mar 13", "1.5 days", "3", "Reviewed"],
                ["Accounting Clerk", "A. Nguyen", "Mar 7", "Mar 11", "3.8 days", "4", "Reviewed"]
              ],
              badges: {
                6: { "Reviewed": "success", "Overdue": "danger", "Pending": "warning" }
              }
            }
          }
        },
        {
          rank: 6,
          name: "HRIS Replacement (TimeQplus)",
          slug: "hris-replacement-timeqplus",
          status: "Not Started",
          who: "Rob Maynard",
          weekly_hours: "~15 min",
          monthly_hours: "~60 min",
          complexity: "High",
          impact: "High",
          description: "Replace TimeQplus with a modern scalable HRIS removing the 50-employee cap and consolidating HR functions.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Current Headcount", value: "50", subtitle: "At system hard cap" },
              { label: "System Capacity", value: "100%", subtitle: "Zero room to grow" },
              { label: "Manual Processes", value: "5", subtitle: "Hours, PTO, payroll, etc." },
              { label: "Growth Target", value: "75+", subtitle: "Next 12 months" }
            ],
            summary: "TimeQplus is at its 50-employee hard cap with zero capacity for additional users. Five critical HR processes (hours tracking, vacation management, payroll export, onboarding, and reporting) remain fully manual. With a growth target of 75+ employees in the next 12 months, HRIS replacement is a growth blocker that must be resolved before the next hiring wave.",
            charts: [
              {
                id: "hr-hris-headcount",
                title: "Headcount vs System Capacity",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Headcount", data: [48,48,48,48,49,49,49,49,49,49,50,50,50,50,50,50,50,50,50,50,50,50] },
                    { label: "System Cap", data: [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50] }
                  ]
                }
              },
              {
                id: "hr-hris-manual-hours",
                title: "Weekly Manual HR Admin Time (hrs)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Manual Admin (hrs)", data: [3.2,2.8,3.5,3.0,3.8,2.9,3.3,3.6,3.1,3.4,2.7,3.5,3.2,3.8,3.0,3.4,2.9,3.6,3.1,3.3,2.8,3.2] }
                  ]
                }
              },
              {
                id: "hr-hris-process-breakdown",
                title: "Manual Process Time Distribution",
                type: "doughnut",
                data: {
                  labels: ["Hours Entry", "PTO Tracking", "Payroll Export", "Reporting", "Onboarding Data"],
                  datasets: [
                    { data: [30, 25, 22, 13, 10] }
                  ]
                }
              }
            ],
            table: {
              columns: ["HRIS Option", "Type", "CA/US Support", "Self-Service", "Cost Tier", "Migration", "Fit Score"],
              rows: [
                ["Humi", "Cloud HRIS", "Strong (CA-first)", "Yes", "Mid", "Moderate", "High"],
                ["BambooHR", "Cloud HRIS", "Good", "Yes", "Mid", "Moderate", "High"],
                ["Rippling", "Cloud HRIS", "Excellent", "Yes", "High", "Full Service", "Medium"],
                ["Gusto", "Cloud HRIS", "US-focused", "Yes", "Low-Mid", "Simple", "Medium"],
                ["Payworks", "Cloud Payroll+", "CA-focused", "Partial", "Low", "Simple", "Medium"],
                ["ADP Workforce Now", "Enterprise", "Excellent", "Yes", "High", "Complex", "Low"],
                ["TimeQplus (Current)", "On-Prem", "Basic", "No", "Low", "N/A", "Blocked"],
                ["Ceridian Dayforce", "Enterprise", "Excellent", "Yes", "High", "Complex", "Low"]
              ],
              badges: {
                6: { "High": "success", "Medium": "warning", "Low": "danger", "Blocked": "danger" }
              }
            }
          }
        }
      ],
    },

    // === IT (MONEX) ===
    {
      name: "IT (Monex)",
      slug: "it-monex",
      priorities: [
        {
          rank: 1,
          name: "AI Request Intake & Ad Hoc Report Automation",
          slug: "ai-request-intake-ad-hoc-report-automation",
          status: "Not Started",
          who: "Jeffrey, team",
          weekly_hours: "~11 hrs",
          monthly_hours: "~44 hrs",
          complexity: "Medium",
          impact: "High",
          description: "AI intake agent that interprets data requests, handles standard queries automatically, and escalates complex ones with context.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Weekly Requests", value: "~7", subtitle: "Ad hoc data requests" },
              { label: "Avg Time/Request", value: "3.5 hrs", subtitle: "Clarify + execute + send" },
              { label: "Total Weekly Cost", value: "~16 hrs", subtitle: "Across full team" },
              { label: "Auto-Eligible", value: "57%", subtitle: "Standard/repeatable" }
            ],
            summary: "The IT team handles approximately 7 ad hoc data requests per week, consuming 14-18 hours of total team capacity (35-45% of weekly bandwidth). Each request averages 3.5 hours including 1-2 hours of back-and-forth clarification. With 57% of requests classified as standard and repeatable, AI intake automation could recover 10-12 hours per week for higher-value work.",
            charts: [
              {
                id: "it-request-volume",
                title: "Daily Ad Hoc Request Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Requests", data: [1,2,1,0,2,1,1,2,1,2,0,2,1,1,2,1,0,2,1,2,1,1] }
                  ]
                }
              },
              {
                id: "it-request-resolution-time",
                title: "Avg Resolution Time per Request (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Resolution Time", data: [3.2,4.1,2.8,3.5,3.8,2.5,4.2,3.0,3.6,2.9,4.5,3.3,2.7,3.9,3.1,4.0,3.4,2.6,3.7,3.2,2.8,3.5] }
                  ]
                }
              },
              {
                id: "it-request-type-breakdown",
                title: "Request Type Distribution",
                type: "doughnut",
                data: {
                  labels: ["MID/TID Counts", "Transaction Summary", "Customer Report", "Multi-System Query", "Other"],
                  datasets: [
                    { data: [28, 22, 20, 18, 12] }
                  ]
                }
              },
              {
                id: "it-team-capacity",
                title: "Team Capacity Used on Ad Hoc (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Capacity %", data: [38,42,35,40,45,33,44,37,41,36,46,39,34,43,38,41,35,44,37,42,33,38] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Request", "Requester", "Type", "Received", "Resolved", "Time (hrs)", "Handled By", "Status"],
              rows: [
                ["Active MID count by region", "Sales", "MID/TID Count", "Apr 7", "Apr 7", "1.5", "Auto-eligible", "Open"],
                ["Q1 transaction summary", "Finance", "Transaction Summary", "Apr 4", "Apr 6", "4.2", "Jeffrey", "Closed"],
                ["SIM card bill verification", "Operations", "Multi-System", "Apr 1", "Apr 5", "32.0", "Jeffrey + Team", "Closed"],
                ["Customer onboarding status", "Admin", "Customer Report", "Mar 31", "Apr 1", "2.8", "Rojeen", "Closed"],
                ["Terminal status by province", "Sales", "Misdirected", "Mar 28", "Mar 28", "0.5", "Redirected", "Closed"],
                ["Monthly revenue by merchant", "Finance", "Transaction Summary", "Mar 26", "Mar 27", "3.5", "MengKai", "Closed"],
                ["New TID activation list", "Operations", "MID/TID Count", "Mar 24", "Mar 24", "1.2", "Auto-eligible", "Closed"],
                ["Chargeback trend report", "Finance", "Customer Report", "Mar 20", "Mar 22", "5.1", "Jeffrey", "Closed"]
              ],
              badges: {
                7: { "Open": "warning", "Closed": "success", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "AI Feature Request Intake & Scoping",
          slug: "ai-feature-request-intake-scoping",
          status: "Not Started",
          who: "Jeffrey",
          weekly_hours: "~3 hrs",
          monthly_hours: "~12 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Structured AI intake layer for feature requests that asks clarifying questions and drafts scoped requirements for review.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Requests/Month", value: "3-5", subtitle: "Feature enhancements" },
              { label: "Clarification Time", value: "~16 hrs/mo", subtitle: "40% of total feature time" },
              { label: "Avg Scoping Time", value: "4.2 hrs", subtitle: "Per feature request" },
              { label: "Incomplete Intake", value: "82%", subtitle: "Missing requirements" }
            ],
            summary: "Feature request intake consumes approximately 16 hours per month in clarification overhead, representing 40% of total feature development time. An estimated 82% of requests arrive without clear problem descriptions or feasibility context. Structured AI intake could reduce clarification time by 75%, recovering 12 hours per month and eliminating developer idle time waiting for finalized requirements.",
            charts: [
              {
                id: "it-feature-intake-time",
                title: "Weekly Feature Clarification Time (hrs)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Clarification (hrs)", data: [3.5,4.2,2.8,5.0,3.0,4.5,3.8,2.5,4.8,3.2,4.0,3.5,5.2,2.8,4.1,3.6,4.8,3.0,3.9,4.5,2.7,4.0] }
                  ]
                }
              },
              {
                id: "it-feature-source",
                title: "Request Source by Department",
                type: "doughnut",
                data: {
                  labels: ["Admin", "Operations", "Sales", "Finance", "Other"],
                  datasets: [
                    { data: [30, 25, 25, 12, 8] }
                  ]
                }
              },
              {
                id: "it-feature-completion-pipeline",
                title: "Feature Request Pipeline Status",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Awaiting Clarification", data: [2,2,3,2,1,2,3,2,2,1,2,3,2,1,2,3,2,1,2,2,1,2] },
                    { label: "Scoped", data: [1,1,1,2,2,1,1,2,1,2,1,1,2,2,1,1,2,2,1,1,2,1] },
                    { label: "In Development", data: [1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Feature Request", "Department", "Received", "Clarification Rounds", "Scoped", "Dev Assigned", "Status"],
              rows: [
                ["CRM lead scoring update", "Sales", "Apr 3", "3", "Apr 7", "Pending", "Scoping"],
                ["Invoice auto-match portal", "Finance", "Mar 28", "2", "Mar 31", "MengKai", "In Dev"],
                ["Customer portal password reset", "Admin", "Mar 25", "4", "Apr 1", "Pending", "Scoping"],
                ["Batch TID activation tool", "Operations", "Mar 20", "1", "Mar 22", "Rojeen", "In Dev"],
                ["Monthly reporting dashboard", "Finance", "Mar 14", "3", "Mar 20", "MengKai", "In Dev"],
                ["Merchant onboarding form v2", "Admin", "Mar 10", "5", "Mar 18", "Rojeen", "Complete"],
                ["Sales territory mapping", "Sales", "Mar 5", "2", "Mar 8", "MengKai", "Complete"],
                ["Automated chargeback alerts", "Operations", "Feb 28", "4", "Mar 7", "Jeffrey", "Complete"]
              ],
              badges: {
                6: { "Scoping": "warning", "In Dev": "info", "Complete": "success", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Data Validation at Point of Entry",
          slug: "data-validation-at-point-of-entry",
          status: "Not Started",
          who: "Jeffrey, Rojeen, MengKai",
          weekly_hours: "~5 hrs",
          monthly_hours: "~20 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automated validation rules at data entry points to catch missing fields, typos, and formatting errors before reaching the database.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Weekly Cleanup Time", value: "~7 hrs", subtitle: "Across 3 team members" },
              { label: "Top Error Types", value: "3", subtitle: "Missing fields, typos, format" },
              { label: "Error Source", value: "Admin/Sales", subtitle: "Primary entry points" },
              { label: "Downstream Impact", value: "12 hrs/mo", subtitle: "Reports + billing fixes" }
            ],
            summary: "Data quality cleanup consumes 6-8 hours per week across all three IT team members, with missing fields, typos, and formatting inconsistencies as the top error categories. Admin and Sales teams are the primary source of dirty data entering the CRM. Downstream impacts add an estimated 12 hours per month in report corrections and billing investigations. Point-of-entry validation could eliminate 63-75% of cleanup effort.",
            charts: [
              {
                id: "it-data-cleanup-hours",
                title: "Weekly Data Cleanup Time (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Cleanup Hours", data: [6.5,7.2,6.8,7.5,6.2,7.8,6.4,7.1,6.9,7.3,6.1,7.6,6.7,7.0,6.4,7.4,6.3,7.2,6.8,7.1,6.5,6.9] }
                  ]
                }
              },
              {
                id: "it-data-error-types",
                title: "Error Type Distribution",
                type: "doughnut",
                data: {
                  labels: ["Missing Fields", "Typos/Misspellings", "Format Inconsistency", "Duplicate Entries", "Invalid Values"],
                  datasets: [
                    { data: [32, 26, 22, 12, 8] }
                  ]
                }
              },
              {
                id: "it-data-errors-by-source",
                title: "Daily Error Count by Source",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Admin", data: [5,7,4,6,8,5,7,6,4,8,5,6,7,4,8,5,7,6,5,7,4,6] },
                    { label: "Sales", data: [4,5,6,4,3,5,4,6,5,3,6,4,5,6,3,5,4,5,6,4,5,4] },
                    { label: "Other", data: [1,2,1,2,1,2,1,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1] }
                  ]
                }
              },
              {
                id: "it-data-downstream-impact",
                title: "Downstream Fix Time (hrs/week)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Downstream Fix (hrs)", data: [2.8,3.2,2.5,3.5,2.9,3.1,2.6,3.4,2.7,3.3,2.4,3.6,2.8,3.0,2.5,3.2,2.7,3.4,2.9,3.1,2.6,2.8] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Field", "System", "Error Type", "Occurrences/Week", "Source Dept", "Impact", "Validation Rule"],
              rows: [
                ["Merchant Name", "CRM", "Typo", "18", "Sales", "Report Mismatch", "Fuzzy Match"],
                ["Province/State", "CRM", "Missing", "15", "Admin", "Billing Error", "Required Field"],
                ["Phone Number", "CRM", "Format", "12", "Sales", "Contact Failure", "Regex Pattern"],
                ["Account Number", "Billing", "Duplicate", "8", "Admin", "Double Billing", "Unique Check"],
                ["Email Address", "CRM", "Invalid", "7", "Admin", "Comms Failure", "Format Check"],
                ["Terminal ID", "CRM", "Missing", "6", "Operations", "Tracking Gap", "Required Field"],
                ["Contract Date", "CRM", "Format", "5", "Sales", "Report Error", "Date Parser"],
                ["Fee Schedule", "Billing", "Invalid", "4", "Admin", "Revenue Impact", "Range Check"]
              ],
              badges: {
                5: { "Report Mismatch": "warning", "Billing Error": "danger", "Contact Failure": "warning", "Double Billing": "danger", "Comms Failure": "warning", "Tracking Gap": "info", "Report Error": "warning", "Revenue Impact": "danger" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Parse Failure Early Warning & Auto-Recovery",
          slug: "parse-failure-early-warning-auto-recovery",
          status: "Not Started",
          who: "Jeffrey",
          weekly_hours: "~1.5-7 days/year",
          monthly_hours: "~1.5-7 days/year",
          complexity: "Medium",
          impact: "Medium",
          description: "Monitoring system that detects external provider file format changes before a full parse failure and attempts auto-recovery.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Parse Failures/Year", value: "3-5", subtitle: "Format change incidents" },
              { label: "Avg Resolution", value: "1.5 days", subtitle: "Per incident" },
              { label: "Late Files/Month", value: "~1", subtitle: "Provider delivery delays" },
              { label: "Pipeline Downtime", value: "~8 days/yr", subtitle: "Total blocked time" }
            ],
            summary: "Parse failures from external provider format changes occur 3-5 times per year, each taking 1-2 days of Jeffrey's time to diagnose and resolve. Combined with approximately 1 late file delivery per month, total pipeline disruption reaches roughly 8 days annually. Early warning detection could cut resolution time by 50-70% and eliminate silent failure scenarios that block downstream billing and reporting.",
            charts: [
              {
                id: "it-parse-pipeline-status",
                title: "Daily Pipeline Health Score",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Health Score %", data: [100,100,100,98,65,72,100,100,100,100,100,100,100,100,100,95,88,100,100,100,100,100] }
                  ]
                }
              },
              {
                id: "it-parse-file-arrivals",
                title: "Provider File Arrival Timeliness",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "On Time", data: [7,7,7,6,5,6,7,7,7,7,7,7,7,7,7,6,6,7,7,7,7,7] },
                    { label: "Late", data: [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0] },
                    { label: "Missing", data: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] }
                  ]
                }
              },
              {
                id: "it-parse-incident-timeline",
                title: "Incident Resolution Time (hrs)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Resolution (hrs)", data: [0,0,0,4,12,8,0,0,0,0,0,0,0,0,0,2,6,0,0,0,0,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Provider", "File Type", "Frequency", "Last Incident", "Resolution (hrs)", "Format Changes/Yr", "Status"],
              rows: [
                ["FiServ US", "Transaction", "Daily", "Mar 13", "12", "2", "Stable"],
                ["FiServ CA", "Transaction", "Daily", "Feb 15", "8", "1", "Stable"],
                ["Elavon", "Settlement", "Daily", "Mar 30", "6", "1", "Warning"],
                ["Global Payments", "Billing", "Weekly", "Jan 22", "16", "2", "Stable"],
                ["Moneris", "Transaction", "Daily", "Dec 10", "10", "1", "Stable"],
                ["Paysafe", "Settlement", "Daily", "Nov 5", "14", "1", "Stable"],
                ["WeVend Internal", "Terminal", "Daily", "N/A", "0", "0", "Stable"]
              ],
              badges: {
                6: { "Stable": "success", "Warning": "warning", "Failing": "danger", "Unknown": "neutral" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "AI-Assisted Tribal Knowledge Documentation",
          slug: "ai-assisted-tribal-knowledge-documentation",
          status: "Not Started",
          who: "Jeffrey",
          weekly_hours: "N/A",
          monthly_hours: "N/A",
          complexity: "Low",
          impact: "High",
          description: "Complete systematic documentation of tribal knowledge using AI to review code and generate plain-language documentation.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Documented Systems", value: "23%", subtitle: "Of critical business logic" },
              { label: "Key-Person Risk", value: "High", subtitle: "Jeffrey holds most knowledge" },
              { label: "Critical Modules", value: "14", subtitle: "Parsing, billing, pipeline" },
              { label: "Onboarding Time", value: "~6 weeks", subtitle: "New team member ramp-up" }
            ],
            summary: "Only 23% of critical business logic across 14 modules is currently documented, with the remaining tribal knowledge concentrated in Jeffrey. New team member onboarding takes approximately 6 weeks due to the documentation gap. AI-assisted documentation is underway but incomplete, with parsing logic for 7 providers and billing calculation rules as the highest-priority targets for systematic capture.",
            charts: [
              {
                id: "it-docs-coverage",
                title: "Documentation Coverage by Module (%)",
                type: "horizontal-bar",
                data: {
                  labels: ["Parse Service", "Billing Engine", "Pipeline Architecture", "CRM Integration", "Portal Logic", "Fee Structures", "Exception Handling"],
                  datasets: [
                    { label: "Documented %", data: [35, 20, 15, 30, 25, 10, 18] }
                  ]
                }
              },
              {
                id: "it-docs-progress",
                title: "Documentation Progress Over Time (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Overall Coverage %", data: [15,15,16,16,17,17,17,18,18,19,19,19,20,20,20,21,21,21,22,22,23,23] }
                  ]
                }
              },
              {
                id: "it-docs-risk-matrix",
                title: "Key-Person Risk by Area",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Risk Score (1-10)", data: [9.2,9.1,9.0,8.9,8.8,8.8,8.7,8.6,8.5,8.4,8.4,8.3,8.2,8.2,8.1,8.0,8.0,7.9,7.9,7.8,7.7,7.7] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Module", "Owner", "Complexity", "Documented", "AI Draft", "Review Status", "Priority"],
              rows: [
                ["FiServ US Parser", "Jeffrey", "High", "35%", "Complete", "Needs Review", "Critical"],
                ["FiServ CA Parser", "Jeffrey", "High", "30%", "Complete", "Needs Review", "Critical"],
                ["Billing Calculations", "Jeffrey", "High", "20%", "In Progress", "Pending", "Critical"],
                ["Fee Structure Rules", "Jeffrey", "Medium", "10%", "Not Started", "Pending", "Critical"],
                ["5-Service Pipeline", "Jeffrey", "High", "15%", "In Progress", "Pending", "High"],
                ["Elavon Parser", "Jeffrey", "Medium", "25%", "Complete", "Reviewed", "High"],
                ["CRM Data Model", "Rojeen", "Medium", "30%", "Not Started", "Pending", "Medium"],
                ["Portal Business Logic", "MengKai", "Medium", "25%", "Not Started", "Pending", "Medium"],
                ["Exception Handling", "Jeffrey", "High", "18%", "In Progress", "Pending", "High"],
                ["Global Payments Parser", "Jeffrey", "Medium", "22%", "Complete", "Needs Review", "High"]
              ],
              badges: {
                5: { "Reviewed": "success", "Needs Review": "warning", "Pending": "neutral" },
                6: { "Critical": "danger", "High": "warning", "Medium": "info", "Low": "neutral" }
              }
            }
          }
        }
      ],
    },

    // === INFRASTRUCTURE & COMPLIANCE ===
    {
      name: "Infrastructure & Compliance",
      slug: "infrastructure-compliance",
      priorities: [
        {
          rank: 1,
          name: "Alert Noise Reduction",
          slug: "alert-noise-reduction",
          status: "Not Started",
          who: "Reza",
          weekly_hours: "1 hr",
          monthly_hours: "~4 hrs",
          complexity: "Low",
          impact: "High",
          description: "Implement intelligent alert filtering and classification for AWS SNS, EventBridge, and Nagios to surface only actionable events.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Weekly Alerts", value: "~340", subtitle: "Across all sources" },
              { label: "Actionable Rate", value: "1.5%", subtitle: "~5 genuine per week" },
              { label: "Monitoring Time", value: "2 hrs/wk", subtitle: "Triage + investigation" },
              { label: "Noise Ratio", value: "98.5%", subtitle: "Non-actionable alerts" }
            ],
            summary: "Infrastructure monitoring generates approximately 340 alerts per week across AWS SNS, EventBridge, and Nagios, but only 1.5% (roughly 5 per week) are genuinely actionable. Reza spends 2 hours per week on monitoring and triage, with the vast majority of that time filtering noise. Intelligent alert classification and suppression could reduce monitoring overhead by 50% while improving response time to genuine incidents.",
            charts: [
              {
                id: "infra-alert-volume",
                title: "Daily Alert Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Total Alerts", data: [45,52,38,61,48,42,55,39,58,44,50,47,62,41,53,46,59,43,51,48,40,56] }
                  ]
                }
              },
              {
                id: "infra-alert-actionable",
                title: "Actionable vs Noise Alerts (Daily)",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Actionable", data: [1,0,1,2,0,1,0,1,1,0,1,0,2,0,1,0,1,1,0,1,0,1] },
                    { label: "Noise", data: [44,52,37,59,48,41,55,38,57,44,49,47,60,41,52,46,58,42,51,47,40,55] }
                  ]
                }
              },
              {
                id: "infra-alert-source",
                title: "Alert Source Distribution",
                type: "doughnut",
                data: {
                  labels: ["AWS SNS", "EventBridge", "Nagios", "CloudWatch", "Custom Scripts"],
                  datasets: [
                    { data: [35, 28, 22, 10, 5] }
                  ]
                }
              },
              {
                id: "infra-alert-severity",
                title: "Alert Severity Breakdown (Weekly)",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Critical", data: [0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0] },
                    { label: "Warning", data: [3,4,2,5,3,3,4,2,4,3,4,3,5,2,4,3,5,3,4,3,2,4] },
                    { label: "Info", data: [42,48,36,55,45,39,51,37,53,41,46,44,56,39,49,43,54,40,47,44,38,52] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Alert", "Source", "Severity", "Time", "Actionable", "Resolution", "Status"],
              rows: [
                ["RDS CPU > 90%", "CloudWatch", "Critical", "Apr 7 09:14", "Yes", "Scaled instance", "Resolved"],
                ["Gateway timeout spike", "AWS SNS", "Warning", "Apr 6 15:22", "Yes", "Provider issue", "Resolved"],
                ["SSL cert expiry 30d", "Nagios", "Warning", "Apr 4 08:00", "Yes", "Renewal queued", "Open"],
                ["S3 bucket access denied", "EventBridge", "Info", "Apr 3 11:45", "No", "Transient", "Suppressed"],
                ["EC2 health check fail", "AWS SNS", "Warning", "Apr 2 03:18", "No", "Auto-recovered", "Suppressed"],
                ["Database backup complete", "Nagios", "Info", "Apr 1 02:00", "No", "Expected", "Suppressed"],
                ["Lambda cold start > 5s", "CloudWatch", "Info", "Mar 31 14:30", "No", "Normal variance", "Suppressed"],
                ["VPN tunnel flap", "Nagios", "Warning", "Mar 28 22:15", "Yes", "ISP issue", "Resolved"],
                ["EBS volume low space", "AWS SNS", "Warning", "Mar 27 16:40", "Yes", "Expanded volume", "Resolved"],
                ["Route 53 health check", "EventBridge", "Info", "Mar 26 07:00", "No", "Transient", "Suppressed"]
              ],
              badges: {
                4: { "Yes": "danger", "No": "neutral" },
                6: { "Resolved": "success", "Open": "warning", "Suppressed": "neutral" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Dev Team Coordination",
          slug: "dev-team-coordination",
          status: "Not Started",
          who: "Reza",
          weekly_hours: "1 hr",
          monthly_hours: "~4 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Establish structured coordination between Infrastructure & Compliance and Development to reduce scheduling back-and-forth.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Coordination Time", value: "2 hrs/wk", subtitle: "Chasing + alignment" },
              { label: "Avg Scheduling Delay", value: "3.2 days", subtitle: "Request to execution" },
              { label: "After-Hours Changes", value: "38%", subtitle: "Due to scheduling gaps" },
              { label: "Blocked Items", value: "2.4/wk", subtitle: "Waiting on dev team" }
            ],
            summary: "Coordination with the development team consumes 2 hours per week and creates an average 3.2-day delay between infrastructure change requests and execution. Approximately 38% of changes are pushed to after-hours due to scheduling gaps, and 2.4 items per week sit blocked waiting on developer availability. A structured async coordination mechanism could halve the coordination overhead and reduce scheduling delays.",
            charts: [
              {
                id: "infra-dev-coordination-time",
                title: "Weekly Coordination Time (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Coordination (hrs)", data: [1.8,2.2,1.5,2.5,2.0,1.7,2.4,1.9,2.1,1.6,2.3,2.0,1.8,2.6,1.5,2.2,1.9,2.4,1.7,2.1,2.0,1.8] }
                  ]
                }
              },
              {
                id: "infra-dev-scheduling-delay",
                title: "Scheduling Delay (days)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Delay (days)", data: [2.5,4.0,2.8,3.5,1.5,3.8,2.2,4.5,3.0,2.0,3.5,4.2,2.8,1.8,3.2,4.0,2.5,3.8,3.0,2.2,3.5,2.8] }
                  ]
                }
              },
              {
                id: "infra-dev-change-timing",
                title: "Change Execution Timing",
                type: "doughnut",
                data: {
                  labels: ["Business Hours", "After Hours", "Weekend", "Emergency"],
                  datasets: [
                    { data: [48, 30, 14, 8] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Change Request", "Type", "Requested", "Scheduled", "Delay (days)", "Timing", "Status"],
              rows: [
                ["Gateway config update", "Production", "Apr 4", "Pending", "3+", "TBD", "Waiting"],
                ["SSL certificate rotation", "Maintenance", "Apr 2", "Apr 7", "5", "After Hours", "Scheduled"],
                ["Database migration v2.4", "Production", "Mar 30", "Apr 3", "4", "Weekend", "Complete"],
                ["Firewall rule update", "Security", "Mar 27", "Mar 28", "1", "Business Hours", "Complete"],
                ["Load balancer tuning", "Production", "Mar 25", "Mar 28", "3", "After Hours", "Complete"],
                ["Monitoring agent update", "Maintenance", "Mar 22", "Mar 24", "2", "Business Hours", "Complete"],
                ["VPN tunnel reconfiguration", "Security", "Mar 18", "Mar 23", "5", "After Hours", "Complete"],
                ["Storage expansion", "Maintenance", "Mar 15", "Mar 17", "2", "Business Hours", "Complete"]
              ],
              badges: {
                6: { "Complete": "success", "Scheduled": "info", "Waiting": "warning", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Incomplete Request Intake",
          slug: "incomplete-request-intake",
          status: "Not Started",
          who: "Reza",
          weekly_hours: "~0.8 hr",
          monthly_hours: "~3.2 hrs",
          complexity: "Low",
          impact: "High",
          description: "Enforce a structured intake template for Jira tickets requiring minimum fields before a request is accepted.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Clarification Loops", value: "~4/wk", subtitle: "Back-and-forth rounds" },
              { label: "Time on Clarification", value: "1 hr/wk", subtitle: "Before work starts" },
              { label: "Missing Fields Rate", value: "68%", subtitle: "Tickets lack key info" },
              { label: "Avg Delay", value: "1.4 days", subtitle: "Clarification-to-start" }
            ],
            summary: "Approximately 68% of incoming Jira tickets and ad-hoc requests arrive missing at least one required field (scope, environment, urgency, or risk assessment), triggering an average of 4 clarification loops per week. This consumes 1 hour weekly and adds a 1.4-day delay before work can begin. A structured intake template with required field enforcement could eliminate 80% of clarification overhead.",
            charts: [
              {
                id: "infra-intake-completeness",
                title: "Ticket Completeness Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Complete on Submit %", data: [28,35,30,25,38,32,28,40,30,35,25,38,32,28,42,30,35,28,38,32,30,34] }
                  ]
                }
              },
              {
                id: "infra-intake-missing-fields",
                title: "Most Commonly Missing Fields",
                type: "horizontal-bar",
                data: {
                  labels: ["Environment(s)", "Risk Assessment", "Business Context", "Urgency Level", "Scope/Systems", "Proposed Timeline"],
                  datasets: [
                    { label: "Missing %", data: [72, 65, 58, 45, 38, 52] }
                  ]
                }
              },
              {
                id: "infra-intake-delay-trend",
                title: "Clarification Delay per Ticket (days)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Delay (days)", data: [1.2,1.8,1.0,2.1,1.5,1.3,1.9,0.8,1.6,1.4,2.0,1.1,1.5,1.8,0.9,1.7,1.3,1.5,1.2,1.8,1.0,1.4] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Ticket", "Requester", "Type", "Received", "Missing Fields", "Clarification Rounds", "Delay (days)", "Status"],
              rows: [
                ["INFRA-412", "Engineering", "Production Change", "Apr 6", "Env, Risk", "2", "1.5", "In Progress"],
                ["INFRA-411", "DevOps", "Security Update", "Apr 3", "None", "0", "0", "Complete"],
                ["INFRA-410", "Admin", "Access Request", "Apr 2", "Scope, Context", "3", "2.5", "In Progress"],
                ["INFRA-409", "Sales", "Integration Setup", "Mar 31", "Env, Risk, Timeline", "3", "3.0", "Blocked"],
                ["INFRA-408", "Engineering", "DB Migration", "Mar 28", "Risk", "1", "0.5", "Complete"],
                ["INFRA-407", "Operations", "Monitoring Change", "Mar 26", "Context, Urgency", "2", "1.8", "Complete"],
                ["INFRA-406", "Finance", "Report Access", "Mar 24", "Scope, Env, Risk", "4", "3.2", "Complete"],
                ["INFRA-405", "Engineering", "Firewall Rule", "Mar 20", "None", "0", "0", "Complete"],
                ["INFRA-404", "Admin", "VPN Setup", "Mar 18", "Context", "1", "0.8", "Complete"]
              ],
              badges: {
                7: { "Complete": "success", "In Progress": "info", "Blocked": "danger", "Waiting": "warning" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "DDQ & Compliance Responses",
          slug: "ddq-compliance-responses",
          status: "Not Started",
          who: "Reza",
          weekly_hours: "~1.6 hrs",
          monthly_hours: "~6.4 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Build a reusable library of pre-approved responses to security questionnaires and DDQs with AI-assisted drafting.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Avg DDQs/Month", value: "3.5", subtitle: "During active sales" },
              { label: "Time per DDQ", value: "2.3 hrs", subtitle: "Draft + validate + send" },
              { label: "Repeat Questions", value: "74%", subtitle: "Previously answered" },
              { label: "Library Coverage", value: "0%", subtitle: "No reusable library" }
            ],
            summary: "DDQ and compliance response workload averages 2 hours per week, spiking to 4 hours during active sales cycles with 3.5 questionnaires per month. An estimated 74% of questions have been answered before but are currently drafted from scratch each time. Building a response library with AI-assisted drafting could reduce per-DDQ effort by 80%, dropping average response time from 2.3 hours to under 30 minutes.",
            charts: [
              {
                id: "infra-ddq-volume",
                title: "Weekly DDQ/Compliance Requests",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "DDQ Requests", data: [0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0] }
                  ]
                }
              },
              {
                id: "infra-ddq-time-per-response",
                title: "Time per DDQ Response (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Time (hrs)", data: [2.5,2.1,2.8,1.9,2.4,2.6,2.0,2.7,2.2,1.8,2.5,2.3,2.9,2.0,2.4,2.1,2.6,2.3,1.9,2.5,2.2,2.3] }
                  ]
                }
              },
              {
                id: "infra-ddq-question-overlap",
                title: "Question Novelty Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Exact Repeat", "Similar to Previous", "Minor Variation", "Novel Question"],
                  datasets: [
                    { data: [42, 22, 10, 26] }
                  ]
                }
              }
            ],
            table: {
              columns: ["DDQ/Request", "Client", "Source", "Questions", "Repeat %", "Time (hrs)", "Status"],
              rows: [
                ["DDQ-2026-018", "Atlantic Financial", "Sales", "45", "78%", "2.1", "In Progress"],
                ["DDQ-2026-017", "Pacific Processing Inc", "Sales", "62", "71%", "2.8", "Complete"],
                ["Evidence-PCI-Q1", "QSA Assessor", "Compliance", "28", "85%", "1.5", "Complete"],
                ["DDQ-2026-016", "Midwest Vending Group", "Sales", "38", "68%", "2.4", "Complete"],
                ["Vendor Risk Assessment", "Summit Partners", "Legal", "55", "72%", "2.6", "Complete"],
                ["DDQ-2026-015", "Northern Retail Co", "Sales", "41", "80%", "1.9", "Complete"],
                ["SOC 2 Evidence Pack", "Internal Audit", "Compliance", "35", "90%", "1.2", "Complete"],
                ["DDQ-2026-014", "Coastal Commerce", "Sales", "48", "65%", "3.1", "Complete"]
              ],
              badges: {
                6: { "In Progress": "info", "Complete": "success", "Overdue": "danger", "Pending": "warning" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Gray-Area Ownership Routing",
          slug: "gray-area-ownership-routing",
          status: "Not Started",
          who: "Reza",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Define a routing framework that determines ownership for cross-department requests, reducing items that default to Reza.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Gray-Area Items/Wk", value: "~6", subtitle: "Unclear ownership" },
              { label: "Time Absorbed", value: "3 hrs/wk", subtitle: "Triage + resolution" },
              { label: "Misrouted Rate", value: "55%", subtitle: "Should not reach Reza" },
              { label: "Avg Resolution", value: "2.8 days", subtitle: "Due to ownership gaps" }
            ],
            summary: "Approximately 6 gray-area items per week land on Infrastructure & Compliance by default, consuming 3 hours of Reza's time. An estimated 55% of these items have clear owners in other departments but are routed to Reza because no ownership framework exists. Average resolution takes 2.8 days due to ownership confusion and context-switching. A lightweight routing framework could redirect half of these items before they reach Reza.",
            charts: [
              {
                id: "infra-grayarea-volume",
                title: "Weekly Gray-Area Items",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Gray-Area Items", data: [1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0] }
                  ]
                }
              },
              {
                id: "infra-grayarea-categories",
                title: "Gray-Area Request Categories",
                type: "doughnut",
                data: {
                  labels: ["AI/Tool Risk Assessment", "Security Review", "Vendor Compliance", "Cross-Functional Change", "Risk Decision"],
                  datasets: [
                    { data: [25, 22, 20, 18, 15] }
                  ]
                }
              },
              {
                id: "infra-grayarea-resolution-time",
                title: "Resolution Time by Category (days)",
                type: "horizontal-bar",
                data: {
                  labels: ["AI/Tool Risk", "Security Review", "Vendor Compliance", "Cross-Functional", "Risk Decision"],
                  datasets: [
                    { label: "Avg Resolution (days)", data: [3.5, 2.2, 3.0, 2.5, 3.8] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Item", "Source Dept", "Category", "Received", "True Owner", "Reza Role", "Resolution (days)", "Status"],
              rows: [
                ["ChatGPT enterprise eval", "Product", "AI/Tool Risk", "Apr 5", "Product + IT", "Input Only", "Pending", "Open"],
                ["New vendor security review", "Operations", "Security Review", "Apr 2", "Infra & Compliance", "Owner", "2", "Resolved"],
                ["Payment integration risk", "Engineering", "Cross-Functional", "Mar 30", "Engineering", "Input Only", "4", "Resolved"],
                ["Insurance cert for vendor", "Finance", "Vendor Compliance", "Mar 27", "Finance", "Not Involved", "3", "Resolved"],
                ["AI copilot tool approval", "Engineering", "AI/Tool Risk", "Mar 24", "Product + IT", "Input Only", "5", "Resolved"],
                ["SOC 2 control mapping", "Internal", "Risk Decision", "Mar 20", "Infra & Compliance", "Owner", "2", "Resolved"],
                ["Contractor VPN access", "Admin", "Security Review", "Mar 17", "Infra & Compliance", "Owner", "1", "Resolved"],
                ["New SaaS vendor DPA review", "Sales", "Vendor Compliance", "Mar 14", "Legal", "Input Only", "4", "Resolved"],
                ["Data retention policy update", "Legal", "Risk Decision", "Mar 10", "Legal + Infra", "Co-Owner", "6", "Resolved"]
              ],
              badges: {
                7: { "Open": "warning", "Resolved": "success", "Escalated": "danger" }
              }
            }
          }
        },
        {
          rank: 6,
          name: "Manual Processes at Scale (IaC)",
          slug: "manual-processes-at-scale-iac",
          status: "In Progress",
          who: "Reza",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "High",
          description: "Automate terminal provisioning and configuration via Infrastructure-as-Code.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Terminals Active", value: "1,500", subtitle: "Current fleet" },
              { label: "Target Scale", value: "10,000", subtitle: "Growth objective" },
              { label: "IaC Coverage", value: "72%", subtitle: "Provisioning automated" },
              { label: "Manual Residual", value: "~28%", subtitle: "Edge cases remain" }
            ],
            summary: "Infrastructure-as-Code implementation is already in progress with 72% of terminal provisioning now automated across the 1,500-terminal fleet. The remaining 28% covers edge cases and legacy configurations that require manual intervention. With a growth target of 10,000 terminals, completing IaC coverage is essential to avoid a linear scaling of operational effort and configuration drift risk.",
            charts: [
              {
                id: "infra-iac-coverage",
                title: "IaC Coverage Progress (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Coverage %", data: [58,59,60,61,62,63,63,64,65,65,66,66,67,68,68,69,69,70,70,71,71,72] }
                  ]
                }
              },
              {
                id: "infra-iac-provisioning-time",
                title: "Avg Provisioning Time per Terminal (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "IaC (min)", data: [8,7,8,6,7,6,5,6,5,5,5,4,5,4,4,4,4,3,4,3,3,3] },
                    { label: "Manual (min)", data: [25,25,24,24,25,24,25,24,24,25,24,25,24,24,25,24,24,25,24,24,25,24] }
                  ]
                }
              },
              {
                id: "infra-iac-terminal-growth",
                title: "Terminal Fleet Growth",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Active Terminals", data: [1462,1465,1468,1470,1473,1475,1478,1480,1482,1485,1487,1489,1491,1493,1495,1497,1498,1500,1500,1500,1500,1500] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Component", "Method", "Terminals Covered", "Coverage %", "Config Drift", "Last Updated", "Status"],
              rows: [
                ["Gateway Config", "Terraform", "1,320", "88%", "Low", "Apr 7", "Active"],
                ["Network Settings", "Ansible", "1,200", "80%", "Low", "Apr 5", "Active"],
                ["Security Policies", "Terraform", "1,080", "72%", "None", "Apr 3", "Active"],
                ["Monitoring Agents", "Ansible", "1,050", "70%", "Low", "Apr 1", "Active"],
                ["SSL Certificates", "Terraform", "990", "66%", "None", "Mar 28", "Active"],
                ["Firmware Updates", "Manual + Script", "750", "50%", "Medium", "Mar 25", "Partial"],
                ["Legacy Configs", "Manual", "420", "28%", "High", "Mar 20", "Manual"],
                ["Edge Case Models", "Manual", "180", "12%", "High", "Mar 15", "Manual"]
              ],
              badges: {
                4: { "None": "success", "Low": "info", "Medium": "warning", "High": "danger" },
                6: { "Active": "success", "Partial": "warning", "Manual": "danger" }
              }
            }
          }
        },
        {
          rank: 7,
          name: "PCI Evidence Gathering",
          slug: "pci-evidence-gathering",
          status: "Not Started",
          who: "Reza",
          weekly_hours: "~0.1 hr",
          monthly_hours: "~0.4 hr",
          complexity: "Medium",
          impact: "Medium",
          description: "Automate tracking, collection, and packaging of PCI compliance evidence throughout the year.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Annual PCI Hours", value: "~60 hrs", subtitle: "Total assessment effort" },
              { label: "Coordination Share", value: "~12 hrs/yr", subtitle: "Evidence gathering" },
              { label: "Evidence Sources", value: "8-12", subtitle: "Cross-department people" },
              { label: "Pre-Assessment Ready", value: "45%", subtitle: "Evidence collected early" }
            ],
            summary: "PCI recertification requires coordinating 8-12 people across 6 departments, with evidence gathering accounting for approximately 12 hours annually. Currently only 45% of required evidence is collected before the active assessment phase, leading to emergency coordination sprints. Automated tracking with scheduled reminders could bring pre-assessment readiness above 80% and eliminate last-minute evidence chasing for both WeVend and WeVend US entities.",
            charts: [
              {
                id: "infra-pci-evidence-readiness",
                title: "Evidence Collection Readiness (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "WeVend", data: [32,33,34,35,35,36,37,38,38,39,40,40,41,42,42,43,43,44,44,45,45,45] },
                    { label: "WeVend US", data: [28,29,30,30,31,32,32,33,34,34,35,36,36,37,38,38,39,40,40,41,41,42] }
                  ]
                }
              },
              {
                id: "infra-pci-control-status",
                title: "PCI Control Evidence Status",
                type: "doughnut",
                data: {
                  labels: ["Current & Filed", "Collected - Needs Review", "Outstanding", "Overdue"],
                  datasets: [
                    { data: [35, 10, 40, 15] }
                  ]
                }
              },
              {
                id: "infra-pci-dept-response",
                title: "Avg Evidence Response Time by Dept (days)",
                type: "horizontal-bar",
                data: {
                  labels: ["Engineering", "DevOps", "Finance", "Product", "Leadership", "External QSA"],
                  datasets: [
                    { label: "Response Time (days)", data: [5.2, 3.8, 7.1, 4.5, 8.2, 2.0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["DSS Requirement", "Control Area", "Owner", "Entity", "Evidence", "Due Date", "Status"],
              rows: [
                ["Req 1", "Firewall Config", "Engineering", "Both", "Config exports", "Jun 30", "Collected"],
                ["Req 2", "Default Passwords", "DevOps", "Both", "Scan results", "Jun 30", "Outstanding"],
                ["Req 3", "Stored Cardholder Data", "Engineering", "WeVend", "Encryption certs", "Jun 30", "Collected"],
                ["Req 5", "Anti-Malware", "DevOps", "Both", "AV scan logs", "Jun 30", "Outstanding"],
                ["Req 6", "Secure Systems", "Engineering", "Both", "Patch records", "Jun 30", "Outstanding"],
                ["Req 7", "Access Control", "Reza", "Both", "ACL exports", "Jun 30", "Collected"],
                ["Req 8", "User Authentication", "Reza", "Both", "MFA evidence", "Jun 30", "Collected"],
                ["Req 10", "Network Monitoring", "DevOps", "WeVend US", "Log samples", "Jun 30", "Outstanding"],
                ["Req 11", "Security Testing", "External QSA", "Both", "Pen test report", "Jun 30", "Overdue"],
                ["Req 12", "Security Policy", "Reza", "Both", "Policy docs", "Jun 30", "Collected"]
              ],
              badges: {
                6: { "Collected": "success", "Outstanding": "warning", "Overdue": "danger", "In Progress": "info" }
              }
            }
          }
        }
      ],
    },

    // === MARKETING ===
    {
      name: "Marketing",
      slug: "marketing",
      priorities: [
        {
          rank: 1,
          name: "Email Campaign Creation",
          slug: "email-campaign-creation",
          status: "In Progress",
          who: "Daniela",
          weekly_hours: "~11.5 hrs",
          monthly_hours: "~46 hrs",
          complexity: "Low",
          impact: "High",
          description: "AI agent handles full email campaign creation cycle; Daniela reviews and approves before scheduling.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Campaigns Sent", value: "11", subtitle: "Last 30 days" },
              { label: "Avg Open Rate", value: "24.3%", subtitle: "Up from 21.8% prior month" },
              { label: "Avg CTR", value: "3.7%", subtitle: "Industry avg 2.6%" },
              { label: "Daniela Hours/Wk", value: "2.1 hrs", subtitle: "Down from 13.5 hrs" }
            ],
            summary: "Email campaign volume reached 11 sends over the past 30 days with the agent handling full creation. The average open rate climbed to 24.3%, up 2.5 points from the prior month, while CTR holds at 3.7% against a 2.6% industry average. Daniela's weekly time dropped from 13.5 hours to 2.1 hours, now limited to review, list pull, and scheduling.",
            charts: [
              {
                id: "mktg-email-open-rate",
                title: "Email Open Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Open Rate", data: [21.2,22.0,21.8,23.1,22.5,23.4,22.9,24.1,23.6,24.8,23.2,24.5,25.1,24.0,23.8,24.9,25.3,24.2,24.6,25.0,24.1,24.3] }
                  ]
                }
              },
              {
                id: "mktg-email-ctr",
                title: "Click-Through Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "CTR", data: [3.1,3.3,3.0,3.5,3.2,3.6,3.4,3.8,3.5,3.9,3.3,3.7,4.0,3.6,3.4,3.8,3.9,3.5,3.7,4.1,3.6,3.7] }
                  ]
                }
              },
              {
                id: "mktg-email-volume-by-vertical",
                title: "Campaigns by Vertical",
                type: "doughnut",
                data: {
                  labels: ["Carwash", "Vending", "Attended", "Cold Monthly"],
                  datasets: [
                    { data: [4, 3, 2, 2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Campaign", "Vertical", "Send Date", "Recipients", "Open Rate", "CTR", "Status"],
              rows: [
                ["Spring Promo Q2", "Carwash", "Apr 7", "1,240", "25.1%", "4.0%", "Sent"],
                ["Contactless Upgrade", "Vending", "Apr 3", "890", "24.8%", "3.9%", "Sent"],
                ["Payment Solutions", "Attended", "Apr 1", "1,105", "24.2%", "3.5%", "Sent"],
                ["Cold Outreach Apr", "Cold Monthly", "Mar 31", "2,300", "18.4%", "2.1%", "Sent"],
                ["Loyalty Feature", "Carwash", "Mar 27", "1,180", "23.8%", "3.4%", "Sent"],
                ["Terminal Refresh", "Vending", "Mar 24", "920", "24.5%", "3.7%", "Sent"],
                ["POS Integration", "Attended", "Mar 20", "1,050", "24.8%", "3.9%", "Sent"],
                ["Cold Outreach Mar", "Cold Monthly", "Mar 17", "2,150", "17.9%", "1.9%", "Sent"],
                ["Fleet Discount", "Carwash", "Mar 13", "1,210", "22.5%", "3.2%", "Sent"],
                ["Telemetry Launch", "Vending", "Mar 10", "870", "22.0%", "3.3%", "Sent"],
                ["Multi-Lane Update", "Carwash", "Mar 9", "1,195", "21.2%", "3.1%", "Sent"]
              ],
              badges: {
                6: { "Sent": "success" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Internal Presentation/Document Requests",
          slug: "internal-presentation-document-requests",
          status: "Not Started",
          who: "Mohamed, Daniela, Arthur",
          weekly_hours: "~10 hrs",
          monthly_hours: "~40 hrs",
          complexity: "High",
          impact: "High",
          description: "Structured intake system plus AI-assisted document production agent for cross-department requests.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Requests This Month", value: "18", subtitle: "Up from 14 last month" },
              { label: "Avg Turnaround", value: "3.2 days", subtitle: "Target: 2 days" },
              { label: "Requests via Form", value: "0%", subtitle: "No intake form yet" },
              { label: "Team Hours/Wk", value: "12 hrs", subtitle: "Mohamed + Daniela + Arthur" }
            ],
            summary: "Cross-department document requests climbed to 18 this month, with an average turnaround of 3.2 days against a 2-day target. All requests still arrive ad hoc via direct message to Mohamed, with zero percent flowing through a structured intake form. The 12 hours per week consumed across the team remains the second-largest time sink after email campaigns.",
            charts: [
              {
                id: "mktg-doc-requests-volume",
                title: "Weekly Request Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Requests", data: [2,1,3,2,1,2,3,1,2,3,1,2,3,2,1,3,2,1,2,3,2,1] }
                  ]
                }
              },
              {
                id: "mktg-doc-turnaround",
                title: "Turnaround Time (days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Turnaround", data: [4.1,3.8,4.5,3.6,3.2,3.9,4.2,3.5,3.0,3.7,4.0,3.4,3.1,3.8,3.5,3.3,2.9,3.6,3.4,3.0,3.1,3.2] }
                  ]
                }
              },
              {
                id: "mktg-doc-by-dept",
                title: "Requests by Source Department",
                type: "doughnut",
                data: {
                  labels: ["Sales", "Operations", "Product", "Leadership", "Other"],
                  datasets: [
                    { data: [7, 4, 3, 3, 1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Request", "Requester", "Department", "Type", "Submitted", "Delivered", "Status"],
              rows: [
                ["Q2 Sales Deck", "John F.", "Sales", "Presentation", "Apr 4", "Apr 7", "Completed"],
                ["Onboarding Manual v3", "Scott M.", "Operations", "Manual", "Apr 2", "-", "In Progress"],
                ["Partner One-Pager", "Roxana D.", "Sales", "Collateral", "Apr 1", "Apr 3", "Completed"],
                ["Product Roadmap Slides", "Prakash K.", "Product", "Presentation", "Mar 31", "Apr 2", "Completed"],
                ["Installation Guide Fix", "Robin L.", "Operations", "Manual", "Mar 28", "-", "Blocked"],
                ["Pricing Sheet Update", "John F.", "Sales", "Collateral", "Mar 27", "Mar 28", "Completed"],
                ["Investor Summary", "Peter K.", "Leadership", "Report", "Mar 26", "Mar 28", "Completed"],
                ["WeVend Brochure", "Prakash K.", "Product", "Collateral", "Mar 24", "Mar 27", "Completed"],
                ["Tradeshow Follow-Up Deck", "Arthur R.", "Marketing", "Presentation", "Mar 20", "Mar 23", "Completed"],
                ["Terminal Spec Sheet", "Scott M.", "Operations", "Collateral", "Mar 18", "Mar 20", "Completed"]
              ],
              badges: {
                6: { "Completed": "success", "In Progress": "warning", "Blocked": "danger" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Social Media Management",
          slug: "social-media-management",
          status: "In Progress",
          who: "Daniela",
          weekly_hours: "~8.5 hrs",
          monthly_hours: "~34 hrs",
          complexity: "Low",
          impact: "High",
          description: "AI agent handles monthly calendar planning, copy drafting, creative briefing, and performance tracking.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Posts This Month", value: "17", subtitle: "Across 3 platforms" },
              { label: "Follower Growth", value: "+8.4%", subtitle: "Target: 10% monthly" },
              { label: "Avg Engagement", value: "4.2%", subtitle: "Up from 3.5% last month" },
              { label: "Daniela Hours/Wk", value: "2.8 hrs", subtitle: "Down from 11 hrs" }
            ],
            summary: "Social media output held at 17 posts across LinkedIn, Instagram, and Facebook, with engagement climbing to 4.2% from 3.5% last month. Follower growth reached 8.4% against the 10% target, narrowing the gap as content quality improves with agent-generated copy. Daniela's weekly time dropped from 11 hours to 2.8 hours, now focused on creative direction and community engagement.",
            charts: [
              {
                id: "mktg-social-engagement",
                title: "Engagement Rate (%)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "LinkedIn", data: [3.8,4.1,3.5,4.3,3.9,4.5,4.0,4.7,4.2,4.8,3.7,4.4,4.6,4.1,3.9,4.5,4.8,4.2,4.3,4.9,4.1,4.4] },
                    { label: "Instagram", data: [4.2,4.5,3.9,4.8,4.3,5.0,4.4,5.2,4.6,5.3,4.1,4.7,5.1,4.5,4.2,4.9,5.2,4.6,4.8,5.4,4.5,4.7] },
                    { label: "Facebook", data: [2.8,3.1,2.6,3.3,2.9,3.4,3.0,3.6,3.2,3.7,2.7,3.3,3.5,3.1,2.8,3.4,3.6,3.1,3.3,3.8,3.0,3.2] }
                  ]
                }
              },
              {
                id: "mktg-social-reach",
                title: "Daily Reach",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Reach", data: [1420,1580,1310,1690,1540,1780,1620,1850,1710,1930,1380,1750,1890,1640,1520,1810,1940,1670,1720,2010,1650,1740] }
                  ]
                }
              },
              {
                id: "mktg-social-followers",
                title: "Cumulative Followers",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Followers", data: [4820,4835,4848,4870,4889,4910,4928,4952,4971,4998,5015,5038,5062,5080,5101,5125,5148,5170,5192,5218,5240,5264] }
                  ]
                }
              },
              {
                id: "mktg-social-content-mix",
                title: "Content Pillar Mix",
                type: "doughnut",
                data: {
                  labels: ["Product", "Industry", "Tradeshow", "Culture", "Testimonials"],
                  datasets: [
                    { data: [5, 4, 3, 3, 2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Post Date", "Platform", "Content Pillar", "Reach", "Engagement", "Clicks", "Status"],
              rows: [
                ["Apr 7", "LinkedIn", "Product", "1,740", "4.4%", "76", "Published"],
                ["Apr 6", "Instagram", "Culture", "1,650", "4.5%", "58", "Published"],
                ["Apr 3", "Facebook", "Industry", "2,010", "3.8%", "42", "Published"],
                ["Apr 2", "LinkedIn", "Testimonial", "1,720", "4.3%", "71", "Published"],
                ["Apr 1", "Instagram", "Product", "1,670", "4.6%", "63", "Published"],
                ["Mar 31", "LinkedIn", "Tradeshow", "1,940", "4.8%", "89", "Published"],
                ["Mar 30", "Facebook", "Product", "1,810", "3.4%", "38", "Published"],
                ["Mar 27", "Instagram", "Industry", "1,520", "4.2%", "55", "Published"],
                ["Mar 26", "LinkedIn", "Culture", "1,640", "4.1%", "67", "Published"],
                ["Mar 25", "Facebook", "Testimonial", "1,890", "3.5%", "41", "Published"]
              ],
              badges: {
                6: { "Published": "success", "Scheduled": "info", "Draft": "neutral" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Tradeshow Materials",
          slug: "tradeshow-materials",
          status: "In Progress",
          who: "Arthur",
          weekly_hours: "~10 hrs (H1)",
          monthly_hours: "~40 hrs (H1)",
          complexity: "Medium",
          impact: "High",
          description: "AI agent handles full materials production cycle for tradeshows during H1 season.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Upcoming Shows", value: "3", subtitle: "Through June 2026" },
              { label: "Materials Produced", value: "14", subtitle: "Brochures, flyers, backdrops" },
              { label: "Leads from Shows", value: "187", subtitle: "Last 2 shows combined" },
              { label: "Arthur Hours/Wk", value: "5.2 hrs", subtitle: "Down from 15 hrs" }
            ],
            summary: "Three shows remain in the H1 calendar through June, with 14 materials pieces produced by the agent so far this season. The last two shows generated 187 combined leads against the 240/month target. Arthur's weekly time dropped from 15 hours to 5.2 hours, with the agent handling all copy and creative briefing while Arthur focuses on logistics and vendor relationships.",
            charts: [
              {
                id: "mktg-tradeshow-leads",
                title: "Leads per Show",
                type: "bar",
                data: {
                  labels: ["CARWASH Jan", "NAMA Feb", "IBS Mar", "NACSShow Apr", "Clean Show May"],
                  datasets: [
                    { label: "Leads Collected", data: [102, 85, 94, 0, 0] }
                  ]
                }
              },
              {
                id: "mktg-tradeshow-materials-timeline",
                title: "Materials Production (cumulative)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Materials", data: [6,6,7,7,7,8,8,9,9,9,10,10,11,11,11,12,12,13,13,13,14,14] }
                  ]
                }
              },
              {
                id: "mktg-tradeshow-time-split",
                title: "Time Split: Agent vs Arthur",
                type: "stacked-bar",
                data: {
                  labels: ["Copy", "Creative Brief", "Outreach Seq", "Follow-Up", "Logistics", "Print Mgmt"],
                  datasets: [
                    { label: "Agent", data: [4.5, 3.0, 2.5, 2.0, 0, 0] },
                    { label: "Arthur", data: [0.5, 0.5, 0.5, 0.2, 2.0, 1.5] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Show", "Date", "Location", "Materials", "Outreach Sent", "Leads", "Status"],
              rows: [
                ["NACSShow", "Apr 22-24", "Las Vegas, NV", "4 pending", "0", "-", "Preparing"],
                ["Clean Show", "May 12-14", "Orlando, FL", "Not started", "0", "-", "Scheduled"],
                ["Payments Canada", "Jun 3-4", "Toronto, ON", "Not started", "0", "-", "Scheduled"],
                ["IBS 2026", "Mar 18-20", "Orlando, FL", "4 complete", "120", "94", "Completed"],
                ["NAMA 2026", "Feb 5-7", "Dallas, TX", "3 complete", "95", "85", "Completed"],
                ["CARWASH 2026", "Jan 13-15", "Nashville, TN", "3 complete", "110", "102", "Completed"]
              ],
              badges: {
                6: { "Preparing": "warning", "Scheduled": "info", "Completed": "success" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Blog Writing",
          slug: "blog-writing",
          status: "In Progress",
          who: "Daniela",
          weekly_hours: "~7 hrs",
          monthly_hours: "~28 hrs",
          complexity: "Low",
          impact: "High",
          description: "AI agent handles SEO-informed article briefs, full draft writing, and brand voice review.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Articles Published", value: "8", subtitle: "Last 30 days" },
              { label: "Organic Traffic", value: "2,340", subtitle: "From blog content" },
              { label: "Avg Time on Page", value: "3:42", subtitle: "Up from 2:58" },
              { label: "Daniela Hours/Wk", value: "1.1 hrs", subtitle: "Down from 8 hrs" }
            ],
            summary: "Blog output reached 8 articles over the past 30 days with the agent producing full first drafts. Organic traffic from blog content hit 2,340 sessions, trending upward toward the 65 organic leads/month SEO target. Average time on page improved to 3 minutes 42 seconds, suggesting agent-generated content is holding reader attention well. Daniela's weekly blog time dropped from 8 hours to 1.1 hours.",
            charts: [
              {
                id: "mktg-blog-traffic",
                title: "Daily Blog Sessions",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Sessions", data: [78,85,92,88,95,102,98,110,105,115,95,108,118,112,120,125,118,130,124,135,128,132] }
                  ]
                }
              },
              {
                id: "mktg-blog-time-on-page",
                title: "Avg Time on Page (seconds)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Seconds", data: [185,192,178,205,198,215,208,225,218,230,195,220,232,210,222,235,228,240,232,245,238,222] }
                  ]
                }
              },
              {
                id: "mktg-blog-by-company",
                title: "Articles by Company",
                type: "doughnut",
                data: {
                  labels: ["MonexGroup", "WeVend"],
                  datasets: [
                    { data: [5, 3] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Article", "Company", "Keyword Target", "Published", "Sessions", "Avg Time", "Status"],
              rows: [
                ["Contactless Payments in Carwash", "MonexGroup", "carwash payment terminal", "Apr 6", "132", "3:48", "Published"],
                ["Unattended Payment Trends 2026", "WeVend", "unattended payment solutions", "Apr 2", "124", "4:02", "Published"],
                ["Vending Machine EMV Guide", "MonexGroup", "vending emv upgrade", "Mar 30", "125", "3:55", "Published"],
                ["Self-Service Kiosk Integration", "WeVend", "kiosk payment integration", "Mar 26", "112", "3:30", "Published"],
                ["Loyalty Programs for Operators", "MonexGroup", "payment loyalty program", "Mar 23", "95", "3:15", "Published"],
                ["Cashless Laundry Solutions", "MonexGroup", "cashless laundry payment", "Mar 18", "110", "3:42", "Published"],
                ["OEM Payment Module Guide", "WeVend", "oem payment terminal", "Mar 13", "95", "3:18", "Published"],
                ["Canadian POS Compliance", "MonexGroup", "canada pos compliance", "Mar 9", "78", "3:05", "Published"]
              ],
              badges: {
                6: { "Published": "success", "Draft": "neutral", "In Review": "warning" }
              }
            }
          }
        },
        {
          rank: 6,
          name: "Marketing Reporting",
          slug: "marketing-reporting",
          status: "Completed",
          who: "Mohamed",
          weekly_hours: "~3.8 hrs",
          monthly_hours: "~15.2 hrs",
          complexity: "Low",
          impact: "High",
          description: "AI agent ingests performance data, runs analysis, generates insights and executive report.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Reports Generated", value: "5", subtitle: "Weekly cadence maintained" },
              { label: "Channels Tracked", value: "7", subtitle: "All marketing channels" },
              { label: "Total Leads (Mar)", value: "312", subtitle: "Across all channels" },
              { label: "Mohamed Hours/Wk", value: "0.5 hrs", subtitle: "Down from 4 hrs" }
            ],
            summary: "The reporting agent has generated 5 consecutive weekly reports with zero missed cadence since going live on March 23. All 7 marketing channels are tracked with month-over-month analysis. Total leads across channels reached 312 for March, with the agent surfacing a 14% decline in Google Ads leads that triggered the master fix plan. Mohamed's reporting time dropped from 4 hours to 30 minutes per week.",
            charts: [
              {
                id: "mktg-reporting-leads-by-channel",
                title: "Leads by Channel (Monthly)",
                type: "stacked-bar",
                data: {
                  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
                  datasets: [
                    { label: "Google Ads", data: [52, 48, 44, 43, 42, 41] },
                    { label: "SEO", data: [45, 48, 52, 55, 58, 62] },
                    { label: "Email", data: [38, 42, 40, 44, 46, 48] },
                    { label: "Social", data: [22, 25, 28, 30, 32, 35] },
                    { label: "Tradeshow", data: [0, 0, 0, 102, 85, 94] },
                    { label: "Cold Outreach", data: [15, 18, 16, 20, 22, 24] },
                    { label: "Referral", data: [5, 6, 5, 7, 6, 8] }
                  ]
                }
              },
              {
                id: "mktg-reporting-spend-vs-leads",
                title: "Marketing Spend vs Leads",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Daily Spend ($)", data: [520,540,510,560,530,550,520,570,540,580,510,560,580,530,550,570,560,590,540,600,550,570] },
                    { label: "Daily Leads", data: [8,10,7,12,9,11,8,13,10,14,7,11,14,9,12,13,11,15,10,16,12,13] }
                  ]
                }
              },
              {
                id: "mktg-reporting-channel-roi",
                title: "Cost per Lead by Channel",
                type: "horizontal-bar",
                data: {
                  labels: ["Google Ads", "SEO", "Email", "Social", "Cold Outreach", "Tradeshow", "Referral"],
                  datasets: [
                    { label: "Cost per Lead ($)", data: [353, 32, 18, 45, 28, 79, 0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Channel", "Budget/Mo", "Leads (Mar)", "CPL", "MoM Change", "Target", "Status"],
              rows: [
                ["Google Ads", "$16,000", "41", "$353", "-2.4%", "440", "Critical"],
                ["SEO/Blog", "$2,000", "62", "$32", "+6.9%", "65", "On Track"],
                ["Email Campaigns", "$850", "48", "$18", "+4.3%", "50", "On Track"],
                ["Social Media", "$1,200", "35", "$45", "+9.4%", "40", "On Track"],
                ["Tradeshows", "$7,500", "94", "$79", "+10.6%", "240 (annual)", "On Track"],
                ["Cold Outreach", "$400", "24", "$28", "+9.1%", "25", "On Track"],
                ["Referral", "$0", "8", "$0", "+33%", "10", "On Track"]
              ],
              badges: {
                6: { "Critical": "danger", "On Track": "success", "At Risk": "warning" }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Lead Scraping & Cold Email",
          slug: "lead-scraping-cold-email",
          status: "In Progress",
          who: "Mohamed, Daniela",
          weekly_hours: "~3.5 hrs",
          monthly_hours: "~14 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "AI agent uses Apollo MCP to search prospects, build lists, and generate cold email sequences.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Campaigns Launched", value: "3", subtitle: "Last 30 days" },
              { label: "Prospects Scraped", value: "1,840", subtitle: "Via Apollo MCP" },
              { label: "Reply Rate", value: "4.8%", subtitle: "Above 3.5% benchmark" },
              { label: "Team Hours/Wk", value: "0.3 hrs", subtitle: "Down from 3.5 hrs" }
            ],
            summary: "Three cold outreach campaigns launched in the past 30 days with 1,840 prospects scraped through Apollo MCP. The reply rate reached 4.8%, well above the 3.5% industry benchmark for cold email. Team time dropped from 3.5 hours per week to roughly 20 minutes, limited to list quality review and sequence approval before launch.",
            charts: [
              {
                id: "mktg-cold-reply-rate",
                title: "Reply Rate by Campaign (%)",
                type: "bar",
                data: {
                  labels: ["Carwash Operators", "Vending Operators", "Attended Merchants"],
                  datasets: [
                    { label: "Reply Rate", data: [5.2, 4.6, 4.5] }
                  ]
                }
              },
              {
                id: "mktg-cold-funnel",
                title: "Cold Outreach Funnel",
                type: "horizontal-bar",
                data: {
                  labels: ["Prospects Scraped", "Emails Sent", "Opened", "Replied", "Meeting Booked"],
                  datasets: [
                    { label: "Count", data: [1840, 1680, 588, 81, 12] }
                  ]
                }
              },
              {
                id: "mktg-cold-sends-daily",
                title: "Daily Emails Sent",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Sent", data: [0,0,0,85,80,82,78,0,0,0,90,88,85,82,0,0,0,92,88,86,84,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Campaign", "Vertical", "Prospects", "Sent", "Opens", "Replies", "Meetings", "Status"],
              rows: [
                ["Apr Cold - Carwash", "Carwash", "680", "620", "217", "32", "5", "Active"],
                ["Apr Cold - Vending", "Vending", "580", "530", "185", "24", "4", "Active"],
                ["Mar Cold - Attended", "Attended", "580", "530", "186", "25", "3", "Completed"],
                ["Pre-Show NACSShow", "Mixed", "420", "380", "133", "18", "3", "Scheduled"],
                ["Mar Cold - Carwash", "Carwash", "310", "280", "98", "12", "2", "Completed"],
                ["Mar Cold - Vending", "Vending", "270", "240", "84", "10", "1", "Completed"]
              ],
              badges: {
                7: { "Active": "info", "Completed": "success", "Scheduled": "warning" }
              }
            }
          }
        },
        {
          rank: 8,
          name: "Google Ads Optimization",
          slug: "google-ads-optimization",
          status: "Completed",
          who: "Mohamed",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "AI agent runs bi-weekly campaign performance analysis and generates optimization recommendations.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Monthly Leads", value: "41", subtitle: "vs 440 target (91% gap)" },
              { label: "Monthly Spend", value: "$14,600", subtitle: "$16K budget" },
              { label: "Avg CPA", value: "$353", subtitle: "Target: <$100" },
              { label: "Mohamed Hours/Wk", value: "1.5 hrs", subtitle: "Down from 3 hrs" }
            ],
            summary: "Google Ads remains critically underperforming at 41 leads per month against the 440-lead target, representing a 91% gap. The average CPA of $353 is more than 3x the target, driven by the competitor campaigns that ran with zero conversions for months. The agent now generates bi-weekly analysis cutting Mohamed's optimization time from 6-hour sessions to 3-hour sessions, and has already flagged $2,034/month in wasted competitor spend for immediate reallocation.",
            charts: [
              {
                id: "mktg-gads-leads",
                title: "Daily Google Ads Leads",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Leads", data: [1,2,1,2,1,2,1,2,1,3,1,2,2,1,2,1,2,1,2,2,1,2] }
                  ]
                }
              },
              {
                id: "mktg-gads-spend-cpa",
                title: "Daily Spend vs CPA",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Daily Spend ($)", data: [480,510,470,520,490,505,475,530,500,540,460,515,535,485,510,490,520,480,510,530,495,505] },
                    { label: "CPA ($)", data: [480,255,470,260,490,253,475,265,500,180,460,258,268,485,255,490,260,480,255,265,495,253] }
                  ]
                }
              },
              {
                id: "mktg-gads-campaign-spend",
                title: "Spend by Campaign Category",
                type: "doughnut",
                data: {
                  labels: ["Contactless/Unattended", "Carwash", "Vending", "Competitor (paused)", "Brand"],
                  datasets: [
                    { data: [5200, 4100, 3200, 2034, 1066] }
                  ]
                }
              },
              {
                id: "mktg-gads-quality-score",
                title: "Avg Quality Score Trend",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Quality Score", data: [4.2,4.2,4.3,4.3,4.4,4.4,4.5,4.5,4.6,4.6,4.7,4.7,4.8,4.8,4.9,4.9,5.0,5.0,5.1,5.1,5.2,5.2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Campaign", "Spend (Mar)", "Leads", "CPA", "CTR", "Conv Rate", "Status"],
              rows: [
                ["Contactless & Unattended - US", "$5,200", "18", "$289", "3.8%", "2.1%", "Active"],
                ["Carwash - Canada", "$4,100", "12", "$342", "2.9%", "1.5%", "Active"],
                ["Vending Machines - US", "$3,200", "8", "$400", "2.4%", "1.2%", "Active"],
                ["Competitor - Nayax", "$1,200", "0", "N/A", "1.1%", "0%", "Paused"],
                ["Competitor - CryptoPay", "$834", "0", "N/A", "0.8%", "0%", "Paused"],
                ["Brand - MonexGroup", "$1,066", "3", "$355", "4.2%", "2.8%", "Active"],
                ["Carwash June2025", "$0", "0", "$1,296", "1.5%", "0.3%", "Paused"]
              ],
              badges: {
                6: { "Active": "info", "Paused": "danger", "Optimizing": "warning" }
              }
            }
          }
        },
        {
          rank: 9,
          name: "SEO Strategy & Content",
          slug: "seo-strategy-content",
          status: "In Progress",
          who: "Arthur",
          weekly_hours: "~2 hrs",
          monthly_hours: "~8 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "AI agent runs weekly keyword searches, competitor gap analysis, and generates content briefs.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Organic Leads (Mar)", value: "62", subtitle: "Target: 65/month" },
              { label: "Keywords Tracked", value: "148", subtitle: "Across both companies" },
              { label: "Content Briefs", value: "6", subtitle: "Generated this month" },
              { label: "Arthur Hours/Wk", value: "0 hrs", subtitle: "Fully automated" }
            ],
            summary: "Organic leads reached 62 in March, closing in on the 65/month target with a steady upward trend. The agent now tracks 148 keywords across both MonexGroup and WeVend, generating 6 content briefs this month that feed directly into Agent 05 for blog drafting. Arthur's SEO research time dropped to zero, with his role shifting entirely to strategic prioritization of which briefs to pursue.",
            charts: [
              {
                id: "mktg-seo-organic-traffic",
                title: "Daily Organic Sessions",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Organic Sessions", data: [142,155,138,168,152,175,160,182,170,190,148,178,195,168,180,198,185,205,192,215,200,210] }
                  ]
                }
              },
              {
                id: "mktg-seo-keyword-positions",
                title: "Keywords in Top 10",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Top 10 Keywords", data: [18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28] }
                  ]
                }
              },
              {
                id: "mktg-seo-competitor-gap",
                title: "Keyword Gap vs Competitors",
                type: "horizontal-bar",
                data: {
                  labels: ["Nayax", "CryptoPay", "WashCard", "Square Canada", "Moneris"],
                  datasets: [
                    { label: "Keywords They Rank, We Don't", data: [42, 35, 28, 22, 18] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Keyword", "Company", "Position", "Volume", "Difficulty", "Brief Status", "Status"],
              rows: [
                ["carwash payment terminal", "MonexGroup", "4", "480", "35", "Published", "Ranking"],
                ["unattended payment solutions", "WeVend", "7", "390", "52", "Published", "Ranking"],
                ["vending machine emv", "MonexGroup", "11", "320", "28", "Published", "Climbing"],
                ["cashless laundry payment", "MonexGroup", "9", "260", "31", "Published", "Ranking"],
                ["kiosk payment integration", "WeVend", "15", "210", "45", "In Progress", "Climbing"],
                ["oem payment terminal", "WeVend", "18", "180", "38", "In Progress", "New"],
                ["contactless payment canada", "MonexGroup", "22", "550", "58", "Queued", "New"],
                ["self service payment kiosk", "WeVend", "25", "420", "48", "Queued", "New"],
                ["car wash pos system", "MonexGroup", "6", "340", "32", "Published", "Ranking"],
                ["vending telemetry payments", "WeVend", "13", "150", "25", "Published", "Climbing"]
              ],
              badges: {
                6: { "Ranking": "success", "Climbing": "info", "New": "neutral", "Dropped": "danger" }
              }
            }
          }
        }
      ],
    },

    // === OPERATIONS ===
    {
      name: "Operations",
      slug: "operations",
      priorities: [
        {
          rank: 1,
          name: "Daily Operational Digest",
          slug: "daily-operational-digest",
          status: "In Progress",
          who: "Scott, Robin, Brian",
          weekly_hours: "~12.5 hrs",
          monthly_hours: "~50 hrs",
          complexity: "Medium",
          impact: "High",
          description: "AI agent compiles a daily briefing covering Zendesk issues, deployments, RMAs, and anomalies for Scott and leadership.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Open Tickets", value: "18", subtitle: "Zendesk + MOTRS combined" },
              { label: "New Today", value: "2", subtitle: "Across all channels" },
              { label: "Unresponded >24h", value: "0", subtitle: "First time this month" },
              { label: "Active Deploys", value: "8", subtitle: "Zero blocked" }
            ],
            summary: "Ticket volume stabilized at 18 open across Zendesk and MOTRS, down from a peak of 24 on April 1. The unresponded-over-24-hour count dropped to zero for the first time this month — all tickets now have first responses within SLA. Deployment activity remains steady at 8 active installs with zero blocked, though the March 24 spike to 3 blocked deployments flagged a recurring SN validation issue now resolved.",
            charts: [
              {
                id: "ops-digest-open-tickets",
                title: "Open Tickets",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Open Tickets", data: [15,14,21,20,19,16,15,22,21,20,17,16,23,22,21,18,17,24,23,22,19,18], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              },
              {
                id: "ops-digest-new-tickets",
                title: "New Tickets (per day)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "New Tickets", data: [6,5,4,3,2,4,3,2,6,5,2,6,5,4,3,5,4,3,2,6,3,2], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-digest-unresponded",
                title: "Unresponded >24h",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Unresponded >24h", data: [1,0,3,2,1,2,1,0,3,2,3,2,1,0,3,0,3,2,1,0,1,0], borderColor: "#C62828", backgroundColor: "rgba(198,40,40,0.1)" }
                  ]
                }
              },
              {
                id: "ops-digest-deployments",
                title: "Deployments",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Active", data: [10,9,8,10,9,9,8,10,9,8,8,10,9,8,10,10,9,8,10,9,9,8], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" },
                    { label: "Blocked", data: [3,2,1,0,0,1,0,0,3,2,0,3,2,1,0,2,1,0,0,3,0,0], borderColor: "#C62828", backgroundColor: "rgba(198,40,40,0.1)" },
                    { label: "Completed", data: [2,1,4,3,2,3,2,1,4,3,4,3,2,1,4,1,4,3,2,1,2,1], borderColor: "#2E7D32", backgroundColor: "rgba(46,125,50,0.1)" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Date", "State", "Open Tickets", "New Tickets", "Unresponded", "Active Deploys", "Blocked", "Completed"],
              rows: [
                ["Apr 7", "Full", "18", "2", "0", "8", "0", "1"],
                ["Apr 6", "Full", "19", "3", "1", "9", "0", "2"],
                ["Apr 3", "Full", "22", "6", "0", "9", "3", "1"],
                ["Apr 2", "Full", "23", "2", "1", "10", "0", "2"],
                ["Apr 1", "Full", "24", "3", "2", "8", "0", "3"],
                ["Mar 31", "Zendesk Only", "17", "4", "3", "9", "1", "4"],
                ["Mar 30", "Full", "18", "5", "0", "10", "2", "1"],
                ["Mar 27", "Full", "21", "3", "3", "10", "0", "4"],
                ["Mar 26", "Deployment Only", "22", "4", "0", "8", "1", "1"],
                ["Mar 25", "No Narrative", "23", "5", "1", "9", "2", "2"],
                ["Mar 24", "Full", "16", "6", "2", "10", "3", "3"],
                ["Mar 23", "Cold Start", "17", "2", "3", "8", "0", "4"]
              ],
              badges: {
                1: {
                  "Full": "success",
                  "Zendesk Only": "warning",
                  "Deployment Only": "warning",
                  "No Narrative": "neutral",
                  "Cold Start": "info",
                  "Both Down": "danger"
                }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Deployment Form Validation & Auto-Chase",
          slug: "deployment-form-validation-auto-chase",
          status: "Not Started",
          who: "Laurie, Suzy, Ngan",
          weekly_hours: "~5 hrs",
          monthly_hours: "~20 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automated validation of deployment forms checking SNs, required fields, and supporting documents with auto-reject for failures.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Forms Submitted", value: "47", subtitle: "Last 22 business days" },
              { label: "Validation Pass Rate", value: "78%", subtitle: "Up from 65% at start" },
              { label: "Avg Chase Time", value: "4.2 hrs", subtitle: "Down from 8 hrs" },
              { label: "Auto-Rejects", value: "10", subtitle: "Saved manual review" }
            ],
            summary: "Validation pass rates improved from 65% to 78% over the reporting period as reps adapted to stricter SN and document checks. Average chase resolution time dropped from 8 hours to 4.2 hours with automated follow-ups replacing manual email threads. The ten auto-rejects caught missing serial numbers and incomplete documentation before they reached the deployment queue.",
            charts: [
              {
                id: "ops-deploy-forms-submitted",
                title: "Forms Submitted (Daily)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Forms Submitted", data: [3,2,1,4,2,3,1,2,3,4,2,1,3,2,4,1,3,2,2,3,1,3], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-deploy-pass-rate",
                title: "Validation Pass Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Pass Rate (%)", data: [65,63,68,66,70,69,72,71,70,73,72,74,73,75,74,76,75,77,76,78,77,78], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              },
              {
                id: "ops-deploy-chase-time",
                title: "Chase Resolution Time (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Chase Time (hrs)", data: [8.1,7.8,7.5,7.2,7.0,6.8,6.5,6.2,6.0,5.8,5.5,5.3,5.1,4.9,4.8,4.7,4.6,4.5,4.4,4.3,4.2,4.2], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              },
              {
                id: "ops-deploy-rejection-reasons",
                title: "Rejection Reasons",
                type: "doughnut",
                data: {
                  labels: ["Missing SN", "Invalid SN", "Missing Docs", "Incomplete Fields"],
                  datasets: [
                    { label: "Rejections", data: [4, 3, 2, 1], backgroundColor: ["#283593", "#5C6BC0", "#9FA8DA", "#C5CAE9"] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Date", "Form ID", "Rep", "Issue", "Status"],
              rows: [
                ["Apr 7", "DF-0047", "Suzy", "None", "Passed"],
                ["Apr 7", "DF-0046", "Ngan", "Missing SN", "Chased"],
                ["Apr 6", "DF-0045", "Laurie", "None", "Passed"],
                ["Apr 3", "DF-0044", "Suzy", "Invalid SN", "Rejected"],
                ["Apr 3", "DF-0043", "Ngan", "None", "Passed"],
                ["Apr 2", "DF-0042", "Laurie", "Missing Docs", "Chased"],
                ["Apr 2", "DF-0041", "Suzy", "None", "Passed"],
                ["Apr 1", "DF-0040", "Ngan", "Incomplete Fields", "Rejected"],
                ["Apr 1", "DF-0039", "Laurie", "None", "Passed"],
                ["Mar 31", "DF-0038", "Suzy", "Missing SN", "Chased"]
              ],
              badges: {
                4: {
                  "Passed": "success",
                  "Chased": "warning",
                  "Rejected": "danger"
                }
              }
            }
          }
        },
        {
          rank: 3,
          name: "RMA Master Sheet Auto-Consolidation",
          slug: "rma-master-sheet-auto-consolidation",
          status: "Not Started",
          who: "Robin, Jack, Brian, Scott",
          weekly_hours: "~5 hrs",
          monthly_hours: "~20 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automated consolidation of Castles' weekly report, Jack's intake log, and internal Master RMA sheet with discrepancy flagging.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "RMAs Consolidated", value: "82", subtitle: "Across all 3 sources" },
              { label: "Discrepancies Found", value: "7", subtitle: "Down from 15 at start" },
              { label: "Avg Sync Time", value: "12 min", subtitle: "Down from 45 min" },
              { label: "Sources Tracked", value: "3", subtitle: "Castles, Jack, Internal" }
            ],
            summary: "Automated consolidation reduced discrepancies from 15 to 7 over the reporting period as source formatting stabilized. Average sync time dropped from 45 minutes of manual cross-referencing to 12 minutes of automated reconciliation. Most remaining discrepancies trace to timing differences between Castles' weekly report and real-time intake entries.",
            charts: [
              {
                id: "ops-rma-volume",
                title: "RMA Volume (Weekly)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "RMA Volume", data: [18,16,22,20,19,17,15,23,21,20,18,16,24,22,21,19,17,25,23,22,20,18], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-rma-discrepancies",
                title: "Discrepancies Flagged",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Discrepancies", data: [5,4,5,4,3,4,3,4,3,3,3,2,3,2,2,2,2,2,1,2,1,1], borderColor: "#C62828", backgroundColor: "rgba(198,40,40,0.1)" }
                  ]
                }
              },
              {
                id: "ops-rma-source-breakdown",
                title: "Source Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Castles Report", "Jack's Log", "Internal Sheet"],
                  datasets: [
                    { label: "RMAs by Source", data: [34, 26, 22], backgroundColor: ["#283593", "#5C6BC0", "#9FA8DA"] }
                  ]
                }
              },
              {
                id: "ops-rma-processing-time",
                title: "Processing Time (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Processing Time (min)", data: [45,42,40,38,36,34,32,30,28,26,24,22,21,20,19,18,17,16,15,14,13,12], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Date", "SN", "Source", "Discrepancy", "Status"],
              rows: [
                ["Apr 7", "CST-4821", "Castles Report", "Missing from Internal Sheet", "Resolved"],
                ["Apr 6", "CST-4799", "Jack's Log", "Model mismatch", "Under Review"],
                ["Apr 3", "CST-4756", "Internal Sheet", "Date discrepancy", "Resolved"],
                ["Apr 2", "CST-4740", "Castles Report", "Duplicate entry", "Resolved"],
                ["Apr 1", "CST-4718", "Jack's Log", "Missing SN", "Resolved"],
                ["Mar 31", "CST-4695", "Internal Sheet", "Status mismatch", "Resolved"],
                ["Mar 30", "CST-4680", "Castles Report", "Count discrepancy", "Resolved"]
              ],
              badges: {
                4: {
                  "Resolved": "success",
                  "Under Review": "warning",
                  "Escalated": "danger"
                }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Inventory Reconciliation Automation",
          slug: "inventory-reconciliation-automation",
          status: "Not Started",
          who: "Laurie, Robin, Scott",
          weekly_hours: "~12 hrs",
          monthly_hours: "~48 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automated comparison of internal inventory chart against Castles' workbook with weekly discrepancy reporting.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Terminals Tracked", value: "1,247", subtitle: "Internal inventory count" },
              { label: "Count Matches", value: "98.2%", subtitle: "Up from 94% baseline" },
              { label: "Discrepancies", value: "22", subtitle: "Down from 75 at start" },
              { label: "Last Reconciliation", value: "Apr 7", subtitle: "Weekly automated run" }
            ],
            summary: "Inventory match rate improved from 94% to 98.2% as recurring discrepancy patterns were identified and corrected upstream. The 22 remaining discrepancies are primarily count mismatches in recently shipped batches where Castles' workbook lags by 1-2 business days. Weekly automated reconciliation replaced a 12-hour manual process, freeing Laurie and Robin for deployment work.",
            charts: [
              {
                id: "ops-inv-count-comparison",
                title: "Inventory Count (Internal vs Castles)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Internal", data: [1240,1242,1245,1243,1248,1250,1252,1249,1253,1255,1251,1254,1256,1258,1255,1250,1248,1252,1249,1246,1245,1247], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" },
                    { label: "Castles", data: [1235,1238,1240,1240,1244,1246,1248,1246,1250,1252,1248,1251,1253,1255,1252,1247,1245,1249,1246,1243,1243,1245], borderColor: "#5C6BC0", backgroundColor: "rgba(92,107,192,0.1)" }
                  ]
                }
              },
              {
                id: "ops-inv-discrepancies",
                title: "Discrepancies Found",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Discrepancies", data: [4,3,3,2,4,3,2,2,3,2,1,3,2,1,2,1,2,3,1,1,1,1], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-inv-match-rate",
                title: "Match Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Match Rate (%)", data: [94.0,94.5,94.8,95.0,95.2,95.5,95.8,96.0,96.2,96.5,96.8,97.0,97.2,97.4,97.5,97.7,97.8,97.9,98.0,98.0,98.1,98.2], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              },
              {
                id: "ops-inv-discrepancy-categories",
                title: "Discrepancy Categories",
                type: "doughnut",
                data: {
                  labels: ["Count Mismatch", "Missing SN", "Model Mismatch", "Location Error"],
                  datasets: [
                    { label: "Categories", data: [10, 5, 4, 3], backgroundColor: ["#283593", "#5C6BC0", "#9FA8DA", "#C5CAE9"] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Date", "SN", "Internal Status", "Castles Status", "Resolution"],
              rows: [
                ["Apr 7", "CST-5012", "In Stock", "Not Listed", "Pending"],
                ["Apr 7", "CST-4998", "Deployed", "In Stock", "Timing Lag"],
                ["Apr 6", "CST-4985", "RMA", "In Stock", "Resolved"],
                ["Apr 3", "CST-4971", "In Stock", "Deployed", "Resolved"],
                ["Apr 3", "CST-4960", "Not Listed", "In Stock", "Under Review"],
                ["Apr 2", "CST-4948", "In Stock", "Model Mismatch", "Resolved"],
                ["Apr 1", "CST-4935", "Deployed", "Not Listed", "Resolved"],
                ["Mar 31", "CST-4920", "In Stock", "Count Mismatch", "Resolved"]
              ],
              badges: {
                4: {
                  "Resolved": "success",
                  "Timing Lag": "info",
                  "Pending": "warning",
                  "Under Review": "warning",
                  "Escalated": "danger"
                }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Self-Service RMA Status Notifications",
          slug: "self-service-rma-status-notifications",
          status: "Not Started",
          who: "CS team",
          weekly_hours: "~0 hrs",
          monthly_hours: "~0 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Automated outbound status notifications to merchants at each stage of the RMA process.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Notifications Sent", value: "0", subtitle: "Not yet launched" },
              { label: "RMAs in Pipeline", value: "82", subtitle: "Across all stages" },
              { label: "Avg Stage Duration", value: "4.2 days", subtitle: "Current baseline" },
              { label: "Merchant Inquiries", value: "12/wk", subtitle: "Status-related calls" }
            ],
            summary: "Self-service notifications remain a scaling play not yet launched. The current 82 RMAs in the pipeline generate roughly 12 merchant inquiries per week, almost all asking for status updates that could be automated. Average stage duration of 4.2 days suggests merchants wait nearly a full business week without proactive communication, driving repeat contacts.",
            charts: [
              {
                id: "ops-rma-pipeline-stages",
                title: "RMA Pipeline by Stage",
                type: "horizontal-bar",
                data: {
                  labels: ["Received", "In Repair", "Awaiting Parts", "Shipped", "Complete"],
                  datasets: [
                    { label: "RMAs", data: [18, 22, 12, 15, 15], backgroundColor: ["#283593", "#5C6BC0", "#9FA8DA", "#C5CAE9", "#E8EAF6"] }
                  ]
                }
              },
              {
                id: "ops-rma-merchant-inquiries",
                title: "Weekly Merchant Inquiries",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Inquiries", data: [14,13,15,12,11,13,14,12,15,13,11,14,13,12,10,13,12,11,14,13,12,12], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              }
            ],
            table: {
              columns: ["RMA #", "Merchant", "Stage", "Days in Stage", "Last Update"],
              rows: [
                ["RMA-2041", "QuickStop Markets", "In Repair", "3", "Apr 6"],
                ["RMA-2039", "Metro Vending Co", "Awaiting Parts", "5", "Apr 3"],
                ["RMA-2037", "CampusSnack Inc", "Received", "1", "Apr 7"],
                ["RMA-2035", "FreshBite Ops", "Shipped", "2", "Apr 6"],
                ["RMA-2033", "VendAll Services", "In Repair", "4", "Apr 4"],
                ["RMA-2031", "GreenVend LLC", "Complete", "0", "Apr 7"],
                ["RMA-2029", "BreakRoom Plus", "Awaiting Parts", "6", "Apr 2"],
                ["RMA-2027", "SnackWave Corp", "In Repair", "2", "Apr 6"],
                ["RMA-2025", "PacificVend", "Received", "1", "Apr 7"],
                ["RMA-2023", "MidWest Machines", "Shipped", "3", "Apr 5"]
              ],
              badges: {
                2: {
                  "Received": "info",
                  "In Repair": "warning",
                  "Awaiting Parts": "danger",
                  "Shipped": "success",
                  "Complete": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 6,
          name: "Collections Outreach Automation",
          slug: "collections-outreach-automation",
          status: "Not Started",
          who: "Brian",
          weekly_hours: "~10 hrs",
          monthly_hours: "~40 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Automated escalation sequences for merchants with broken contracts or outstanding rejected payments.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Active Accounts", value: "38", subtitle: "In collections pipeline" },
              { label: "Monthly Recovery", value: "$28,400", subtitle: "Up from $22K baseline" },
              { label: "Escalation Rate", value: "72%", subtitle: "Accounts reaching Day 14+" },
              { label: "Avg Days to Resolve", value: "18", subtitle: "Down from 25 days" }
            ],
            summary: "Monthly recovery increased from $22,000 to $28,400 as automated escalation sequences replaced manual follow-ups. The 38 active accounts are progressing through Day 7, 14, and 21 checkpoints with 72% reaching the Day 14 escalation stage before resolution. Average resolution time dropped from 25 to 18 days, though 6 accounts remain in manual escalation requiring Brian's direct intervention.",
            charts: [
              {
                id: "ops-collections-recovery",
                title: "Monthly Recovery ($)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Recovery ($)", data: [800,1200,950,1100,1300,1400,1050,1250,1350,1500,1100,1300,1450,1600,1200,1400,1550,1700,1300,1500,1650,1400], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-collections-active",
                title: "Active Collection Accounts",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Active Accounts", data: [42,40,43,41,39,37,40,42,38,36,39,41,37,35,38,40,36,34,37,39,38,38], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              },
              {
                id: "ops-collections-stages",
                title: "Escalation Stage Distribution",
                type: "doughnut",
                data: {
                  labels: ["Day 7", "Day 14", "Day 21", "Manual"],
                  datasets: [
                    { label: "Accounts", data: [11, 13, 8, 6], backgroundColor: ["#283593", "#5C6BC0", "#9FA8DA", "#C5CAE9"] }
                  ]
                }
              },
              {
                id: "ops-collections-resolution-time",
                title: "Resolution Time (days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Avg Resolution (days)", data: [25,24,24,23,23,22,22,21,21,21,20,20,20,19,19,19,19,18,18,18,18,18], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Account", "Merchant", "Amount", "Stage", "Days Open"],
              rows: [
                ["COL-1012", "BreakTime Vending", "$2,400", "Day 21", "23"],
                ["COL-1015", "QuickBite LLC", "$1,800", "Day 14", "16"],
                ["COL-1018", "SnackHub Corp", "$3,200", "Manual", "32"],
                ["COL-1021", "VendPro Services", "$950", "Day 7", "8"],
                ["COL-1024", "FreshMart Ops", "$1,600", "Day 14", "15"],
                ["COL-1027", "CoinOp Plus", "$2,100", "Day 21", "22"],
                ["COL-1030", "Metro Snacks", "$750", "Day 7", "6"],
                ["COL-1033", "PacificVend Co", "$4,500", "Manual", "38"],
                ["COL-1036", "Campus Eats", "$1,200", "Day 14", "14"],
                ["COL-1039", "GreenMachine LLC", "$880", "Day 7", "9"]
              ],
              badges: {
                3: {
                  "Day 7": "info",
                  "Day 14": "warning",
                  "Day 21": "danger",
                  "Manual": "danger"
                }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Customer Self-Service / FAQ Automation",
          slug: "customer-self-service-faq-automation",
          status: "Not Started",
          who: "Robin, Janice, Roxanne",
          weekly_hours: "~20 hrs",
          monthly_hours: "~80 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Self-service knowledge base or AI chat tool for merchants to resolve common inquiries without contacting CS.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Daily Contacts", value: "118", subtitle: "Calls + emails + outbound" },
              { label: "Deflection Rate", value: "0%", subtitle: "No self-service yet" },
              { label: "Top Category", value: "Billing", subtitle: "28% of all contacts" },
              { label: "Est. Deflectable", value: "30/day", subtitle: "~25% of inbound volume" }
            ],
            summary: "Current daily contact volume of 118 across calls, emails, and outbound creates significant scaling risk with no self-service deflection in place. Billing inquiries represent the largest category at 28%, followed by portal access and troubleshooting. An estimated 30 contacts per day could be deflected through FAQ automation or an AI chat tool, saving roughly 20 hours per week of CS team time.",
            charts: [
              {
                id: "ops-selfservice-contact-volume",
                title: "Daily Contact Volume",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Inbound Calls", data: [52,48,55,50,47,53,49,56,51,48,54,50,57,52,49,55,51,58,53,50,52,48], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" },
                    { label: "Emails", data: [35,32,38,34,31,36,33,39,35,32,37,34,40,36,33,38,35,41,37,34,36,33], borderColor: "#5C6BC0", backgroundColor: "rgba(92,107,192,0.1)" },
                    { label: "Outbound", data: [28,25,30,27,24,29,26,31,28,25,30,27,32,29,26,31,28,33,30,27,30,27], borderColor: "#9FA8DA", backgroundColor: "rgba(159,168,218,0.1)" }
                  ]
                }
              },
              {
                id: "ops-selfservice-categories",
                title: "Contact Categories",
                type: "doughnut",
                data: {
                  labels: ["Billing", "Portal Access", "Troubleshooting", "RMA Status", "Profile Changes", "Other"],
                  datasets: [
                    { label: "Contacts", data: [33, 22, 20, 18, 14, 11], backgroundColor: ["#283593", "#3949AB", "#5C6BC0", "#7986CB", "#9FA8DA", "#C5CAE9"] }
                  ]
                }
              },
              {
                id: "ops-selfservice-deflectable",
                title: "Estimated Deflectable Contacts",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Self-Service", data: [29,26,31,28,25,30,27,32,29,26,31,28,33,30,27,32,29,34,31,28,30,27], backgroundColor: "#283593" },
                    { label: "Requires Agent", data: [86,79,92,83,77,88,81,94,85,79,90,83,96,87,81,92,85,98,89,83,88,81], backgroundColor: "#9FA8DA" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Category", "Weekly Volume", "Avg Handle Time", "Deflectable?", "Priority"],
              rows: [
                ["Billing", "165", "8 min", "Yes", "High"],
                ["Portal Access", "110", "12 min", "Yes", "High"],
                ["Troubleshooting", "100", "15 min", "Partial", "Medium"],
                ["RMA Status", "90", "6 min", "Yes", "High"],
                ["Profile Changes", "70", "10 min", "Yes", "Medium"],
                ["New Setup", "45", "20 min", "No", "Low"],
                ["Escalations", "30", "25 min", "No", "Low"],
                ["Other", "55", "8 min", "Partial", "Low"]
              ],
              badges: {
                3: {
                  "Yes": "success",
                  "Partial": "warning",
                  "No": "danger"
                },
                4: {
                  "High": "danger",
                  "Medium": "warning",
                  "Low": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 8,
          name: "US Collections — Kingston Data and Credit Handoff",
          slug: "us-collections-kingston-data-and-credit-handoff",
          status: "Not Started",
          who: "Brian",
          weekly_hours: "~0.75 hr",
          monthly_hours: "~3 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Formalize process for identifying US merchants with contract damages and submitting to Kingston Data and Credit.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "US Accounts Identified", value: "0", subtitle: "Process not yet started" },
              { label: "Est. Recovery Opportunity", value: "$--", subtitle: "To be quantified" },
              { label: "Process Status", value: "Design Phase", subtitle: "Modeling on CA process" },
              { label: "Canada Benchmark", value: "$30K/mo", subtitle: "Current CA recovery rate" }
            ],
            summary: "US collections via Kingston Data and Credit represents an untapped revenue opportunity modeled on the Canadian collections process that recovers approximately $30,000 per month. The design phase is focused on identifying US merchants with contract damages and formalizing the submission workflow. Monthly US cancellation volume has been growing, increasing the urgency of establishing this handoff process.",
            charts: [
              {
                id: "ops-uscollections-ca-recovery",
                title: "Canadian Collections Recovery (Monthly)",
                type: "bar",
                data: {
                  labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr (est)"],
                  datasets: [
                    { label: "Recovery ($)", data: [25000, 28000, 27000, 30000, 32000, 30000], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-uscollections-us-cancellations",
                title: "US Cancellations (Monthly)",
                type: "line",
                data: {
                  labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr (est)"],
                  datasets: [
                    { label: "US Cancellations", data: [8, 10, 12, 14, 16, 18], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Step", "Owner", "Status", "Target Date"],
              rows: [
                ["Identify US contract damage criteria", "Brian", "Not Started", "Apr 14"],
                ["Map CA process to US requirements", "Brian", "Not Started", "Apr 18"],
                ["Contact Kingston Data and Credit", "Scott", "Not Started", "Apr 21"],
                ["Define submission template", "Brian", "Not Started", "Apr 25"],
                ["Create merchant identification query", "Brian", "Not Started", "Apr 28"],
                ["Test with 5 pilot accounts", "Brian", "Not Started", "May 5"],
                ["Establish recurring submission cadence", "Scott", "Not Started", "May 12"],
                ["Track first recovery cycle", "Brian", "Not Started", "Jun 1"]
              ],
              badges: {
                2: {
                  "Not Started": "neutral",
                  "In Progress": "warning",
                  "Complete": "success",
                  "Blocked": "danger"
                }
              }
            }
          }
        },
        {
          rank: 9,
          name: "Out-of-Warranty Cost Recovery Process",
          slug: "out-of-warranty-cost-recovery-process",
          status: "Not Started",
          who: "Scott, Brian",
          weekly_hours: "~0 hrs",
          monthly_hours: "~0 hrs",
          complexity: "Low",
          impact: "High",
          description: "Design end-to-end process for handling out-of-warranty RMA situations before the first cohort comes off warranty.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "OOW Cases", value: "0", subtitle: "None yet — first cohort pending" },
              { label: "Expected Next 90 Days", value: "30-50", subtitle: "Based on warranty dates" },
              { label: "Process Status", value: "Design Phase", subtitle: "Pre-implementation" },
              { label: "Est. Time Saved", value: "35 hrs/qtr", subtitle: "Once process is live" }
            ],
            summary: "The first cohort of terminals comes off warranty in the next 60-90 days, making process design urgent. Based on deployment dates, 30-50 terminals will require out-of-warranty handling in Q2, growing to 80-120 by Q3. Without a defined process, each OOW case currently requires ad-hoc coordination between Scott and Brian, estimated at 1.5-2 hours per case.",
            charts: [
              {
                id: "ops-oow-warranty-timeline",
                title: "Terminal Warranty Expiration Timeline",
                type: "bar",
                data: {
                  labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                  datasets: [
                    { label: "Expirations", data: [12, 18, 25, 30, 28, 22], backgroundColor: "#5C6BC0" }
                  ]
                }
              },
              {
                id: "ops-oow-projected-volume",
                title: "Projected OOW Volume",
                type: "line",
                data: {
                  labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                  datasets: [
                    { label: "Cumulative OOW", data: [12, 30, 55, 85, 113, 135], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Component", "Owner", "Status", "Notes"],
              rows: [
                ["Define OOW criteria and thresholds", "Scott", "Not Started", "Warranty terms vary by model"],
                ["Create merchant notification template", "Brian", "Not Started", "Email + portal notice"],
                ["Design cost recovery pricing", "Scott", "Not Started", "Repair vs replace decision tree"],
                ["Build OOW intake form", "Brian", "Not Started", "Extend existing RMA form"],
                ["Set up billing workflow", "Scott", "Not Started", "Integration with invoicing"],
                ["Create internal SOP", "Scott", "Not Started", "Step-by-step for CS team"],
                ["Pilot with first 5 OOW cases", "Brian", "Not Started", "Target: May"],
                ["Iterate and finalize process", "Scott", "Not Started", "Target: Jun"]
              ],
              badges: {
                2: {
                  "Not Started": "neutral",
                  "In Progress": "warning",
                  "Complete": "success",
                  "Blocked": "danger"
                }
              }
            }
          }
        },
        {
          rank: 10,
          name: "Tribal Knowledge Documentation",
          slug: "tribal-knowledge-documentation",
          status: "Not Started",
          who: "All Ops",
          weekly_hours: "N/A",
          monthly_hours: "N/A",
          complexity: "Low",
          impact: "Critical",
          description: "Formal documentation of critical tribal knowledge risks: Ngan's forms, Laurie's deployments, Brian's Collections, Scott's Legal.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Processes Documented", value: "0 of 4", subtitle: "Critical gap" },
              { label: "Risk Level", value: "Critical", subtitle: "Single points of failure" },
              { label: "People at Risk", value: "4", subtitle: "Laurie, Brian, Scott, Ngan" },
              { label: "Est. Documentation Time", value: "10 hrs", subtitle: "Total across all 4" }
            ],
            summary: "Four critical operational processes remain entirely undocumented, each held by a single person with no backup. If any of these individuals were unavailable, the associated process would halt completely. Ngan's deployment form knowledge and Laurie's deployment coordination are the highest risk given their direct impact on revenue-generating installations.",
            charts: [
              {
                id: "ops-tribal-risk-by-person",
                title: "Knowledge Risk by Person",
                type: "horizontal-bar",
                data: {
                  labels: ["Laurie", "Brian", "Scott", "Ngan"],
                  datasets: [
                    { label: "Risk Score", data: [95, 85, 80, 90], backgroundColor: ["#C62828", "#E53935", "#EF5350", "#C62828"] }
                  ]
                }
              },
              {
                id: "ops-tribal-coverage",
                title: "Documentation Coverage",
                type: "doughnut",
                data: {
                  labels: ["Documented", "Partial", "Undocumented"],
                  datasets: [
                    { label: "Processes", data: [0, 0, 4], backgroundColor: ["#2E7D32", "#F9A825", "#C62828"] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Person", "Process", "Risk Level", "Backup", "Status"],
              rows: [
                ["Ngan", "Deployment form processing and validation", "Critical", "None", "Undocumented"],
                ["Laurie", "Deployment coordination and scheduling", "Critical", "None", "Undocumented"],
                ["Brian", "Collections escalation and merchant negotiation", "High", "None", "Undocumented"],
                ["Scott", "Legal review and contract dispute resolution", "High", "None", "Undocumented"],
                ["Laurie", "Inventory reconciliation procedures", "Medium", "Robin (partial)", "Undocumented"],
                ["Brian", "RMA intake and triage decisions", "Medium", "Robin (partial)", "Undocumented"],
                ["Scott", "Vendor relationship management", "Medium", "None", "Undocumented"],
                ["Ngan", "SN validation rules and exception handling", "High", "None", "Undocumented"]
              ],
              badges: {
                2: {
                  "Critical": "danger",
                  "High": "warning",
                  "Medium": "info"
                },
                4: {
                  "Undocumented": "danger",
                  "Partial": "warning",
                  "Documented": "success"
                }
              }
            }
          }
        },
        {
          rank: 11,
          name: "Billing Reconciliation (SIM, Castles/LazyIOS, KioSoft/PayRange)",
          slug: "billing-reconciliation-sim-castles-lazyios-kiosoft-payrange",
          status: "Not Started",
          who: "Scott",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automate reconciliation of SIM fees, vendor invoices, and third-party software charges against internal records.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Streams Reconciled", value: "3", subtitle: "SIM, Castles, KioSoft" },
              { label: "Monthly Variance", value: "$--", subtitle: "Not yet quantified" },
              { label: "SIM Coverage", value: "Unknown", subtitle: "No baseline audit" },
              { label: "Last Audit", value: "Never", subtitle: "No formal reconciliation" }
            ],
            summary: "Three billing streams remain unreconciled with no baseline audit ever performed. SIM fee billing is the largest unknown, with no visibility into whether all active terminals are correctly billed. Castles/LazyIOS and KioSoft/PayRange invoices are accepted at face value without cross-referencing against internal deployment records, creating potential revenue leakage that cannot be quantified until the first reconciliation is complete.",
            charts: [
              {
                id: "ops-billing-sim-fees",
                title: "SIM Fee Billing (Monthly)",
                type: "bar",
                data: {
                  labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr (est)"],
                  datasets: [
                    { label: "Billed ($)", data: [4200, 4350, 4500, 4600, 4750, 4800], backgroundColor: "#5C6BC0" },
                    { label: "Expected ($)", data: [4400, 4500, 4650, 4800, 4900, 5000], backgroundColor: "#9FA8DA" }
                  ]
                }
              },
              {
                id: "ops-billing-validation-rate",
                title: "Invoice Validation Rate",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Validation Rate (%)", data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], borderColor: "#283593", backgroundColor: "rgba(40,53,147,0.1)" }
                  ]
                }
              },
              {
                id: "ops-billing-streams",
                title: "Reconciliation Streams",
                type: "doughnut",
                data: {
                  labels: ["SIM Fees", "Castles/LazyIOS", "KioSoft/PayRange"],
                  datasets: [
                    { label: "Est. Monthly ($)", data: [4800, 8200, 3500], backgroundColor: ["#283593", "#5C6BC0", "#9FA8DA"] }
                  ]
                }
              },
              {
                id: "ops-billing-leakage",
                title: "Estimated Revenue Leakage",
                type: "bar",
                data: {
                  labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr (est)"],
                  datasets: [
                    { label: "Est. Leakage ($)", data: [200, 150, 150, 200, 150, 200], backgroundColor: "#C62828" }
                  ]
                }
              }
            ],
            table: {
              columns: ["Stream", "Vendor", "Frequency", "Last Checked", "Gap"],
              rows: [
                ["SIM Fees", "Rogers/Telus", "Monthly", "Never", "No baseline"],
                ["Terminal Licensing", "Castles", "Monthly", "Never", "No cross-reference"],
                ["LazyIOS Fees", "LazyIOS", "Monthly", "Never", "No validation"],
                ["KioSoft Licensing", "KioSoft", "Monthly", "Never", "No reconciliation"],
                ["PayRange Fees", "PayRange", "Monthly", "Never", "No audit trail"],
                ["Processing Fees", "Various", "Monthly", "Never", "Accepted at face value"]
              ],
              badges: {
                4: {
                  "No baseline": "danger",
                  "No cross-reference": "danger",
                  "No validation": "danger",
                  "No reconciliation": "danger",
                  "No audit trail": "danger",
                  "Accepted at face value": "warning",
                  "Reconciled": "success"
                }
              }
            }
          }
        }
      ],
    },

    // === PRODUCT MANAGEMENT ===
    {
      name: "Product Management",
      slug: "product-management",
      priorities: [
        {
          rank: 1,
          name: "Scoping & Requirements Clarity (Intake Process)",
          slug: "scoping-requirements-clarity-intake-process",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~2.3 hrs",
          monthly_hours: "~9.2 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Structured, repeatable intake and scoping process with standardized forms and Claude-powered vetting.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Requests This Week", value: "4", subtitle: "Consistent with average" },
              { label: "Avg Scoping Time", value: "2.8 hrs", subtitle: "Target: 1.5 hrs" },
              { label: "Scope Changes Mid-Sprint", value: "3", subtitle: "Last 30 days" },
              { label: "Incomplete Submissions", value: "62%", subtitle: "Missing required fields" }
            ],
            summary: "Four new requests arrived this week matching the 3-4 per week average, but 62% of submissions still lack required fields like problem statement or scope boundaries. Average scoping time remains at 2.8 hours due to clarification back-and-forth, well above the 1.5-hour target. Three mid-sprint scope changes occurred in the last 30 days, each traceable to incomplete initial requirements.",
            charts: [
              {
                id: "pm-scoping-requests",
                title: "Weekly Request Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Requests", data: [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0] }
                  ]
                }
              },
              {
                id: "pm-scoping-time",
                title: "Scoping Time per Request (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Scoping Hours", data: [3.2,0,2.8,3.5,0,2.4,0,3.1,0,2.6,0,3.0,2.9,0,2.5,3.3,0,2.7,0,2.8,3.0,0] }
                  ]
                }
              },
              {
                id: "pm-scoping-source",
                title: "Requests by Source",
                type: "doughnut",
                data: {
                  labels: ["Sales", "Support", "Engineering", "Leadership", "Customer Direct"],
                  datasets: [
                    { data: [6, 4, 3, 2, 1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Request", "Source", "Submitted", "Scoping Time", "Fields Complete", "Scope Changes", "Status"],
              rows: [
                ["Multi-currency support", "Sales", "Apr 6", "3.0 hrs", "5/8", "0", "Scoping"],
                ["Firmware OTA update flow", "Engineering", "Apr 3", "2.8 hrs", "7/8", "0", "Scoped"],
                ["Partner portal SSO", "Leadership", "Apr 1", "2.7 hrs", "4/8", "1", "In Sprint"],
                ["Loyalty points display", "Sales", "Mar 30", "3.3 hrs", "3/8", "1", "In Sprint"],
                ["Receipt customization API", "Customer Direct", "Mar 27", "2.5 hrs", "6/8", "0", "Scoped"],
                ["Terminal health dashboard", "Support", "Mar 24", "3.0 hrs", "4/8", "1", "In Sprint"],
                ["Batch settlement report", "Sales", "Mar 20", "2.6 hrs", "5/8", "0", "Completed"],
                ["App timeout configuration", "Support", "Mar 17", "2.4 hrs", "7/8", "0", "Completed"],
                ["Processor failover logic", "Engineering", "Mar 12", "3.5 hrs", "6/8", "0", "Completed"],
                ["Carwash bundle pricing", "Sales", "Mar 9", "3.2 hrs", "3/8", "2", "Completed"]
              ],
              badges: {
                6: { "Scoping": "warning", "Scoped": "info", "In Sprint": "info", "Completed": "success" }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Interactive Reporting Dashboard (Roadmap)",
          slug: "interactive-reporting-dashboard-roadmap",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~2.25 hrs",
          monthly_hours: "~9 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Replace manual weekly PowerPoint roadmap with an interactive dashboard auto-pulling from Jira.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Pipeline Items", value: "6", subtitle: "Active roadmap features" },
              { label: "Report Time/Wk", value: "2.5 hrs", subtitle: "Manual PowerPoint" },
              { label: "On Track", value: "4 of 6", subtitle: "2 items delayed" },
              { label: "Stakeholder Updates", value: "1/wk", subtitle: "Weekly cadence" }
            ],
            summary: "Six features are actively on the roadmap with 4 tracking on schedule and 2 delayed due to mid-sprint scope changes. Prakash still spends 2.5 hours per week manually building the PowerPoint roadmap dashboard, with 50% of that time on formatting alone. The interactive dashboard would eliminate the manual process entirely, giving leadership real-time access instead of weekly snapshots.",
            charts: [
              {
                id: "pm-roadmap-status",
                title: "Roadmap Item Status",
                type: "doughnut",
                data: {
                  labels: ["On Track", "At Risk", "Delayed", "Completed"],
                  datasets: [
                    { data: [4, 1, 1, 3] }
                  ]
                }
              },
              {
                id: "pm-roadmap-progress",
                title: "Feature Completion (%)",
                type: "horizontal-bar",
                data: {
                  labels: ["Multi-currency", "OTA Updates", "Partner SSO", "Loyalty v2", "Receipt API", "Health Dashboard"],
                  datasets: [
                    { label: "Completion %", data: [15, 72, 45, 88, 60, 35] }
                  ]
                }
              },
              {
                id: "pm-roadmap-velocity",
                title: "Sprint Velocity (story points)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Velocity", data: [0,3,5,8,12,14,0,4,7,11,15,18,0,3,6,10,14,17,0,4,8,12] }
                  ]
                }
              },
              {
                id: "pm-roadmap-time-breakdown",
                title: "Prakash Weekly Time Breakdown (hrs)",
                type: "stacked-bar",
                data: {
                  labels: ["Wk Mar 9", "Wk Mar 16", "Wk Mar 23", "Wk Mar 30", "Wk Apr 6"],
                  datasets: [
                    { label: "Formatting", data: [1.3, 1.4, 1.2, 1.5, 1.3] },
                    { label: "Data Gathering", data: [0.8, 0.9, 0.7, 0.8, 0.8] },
                    { label: "Commentary", data: [0.5, 0.4, 0.6, 0.5, 0.4] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Feature", "Phase", "Owner", "Sprint", "Progress", "Target Date", "Status"],
              rows: [
                ["Multi-currency Support", "Discovery", "Prakash", "-", "15%", "Q3 2026", "On Track"],
                ["Firmware OTA Updates", "Development", "Sohail", "Sprint 14", "72%", "Apr 25", "On Track"],
                ["Partner Portal SSO", "Requirements", "Prakash", "Sprint 15", "45%", "May 15", "At Risk"],
                ["Loyalty Points v2", "QA/Testing", "Sohail", "Sprint 13", "88%", "Apr 11", "On Track"],
                ["Receipt Customization API", "Development", "Prakash", "Sprint 14", "60%", "Apr 30", "On Track"],
                ["Terminal Health Dashboard", "Requirements", "Sohail", "Sprint 15", "35%", "May 22", "Delayed"],
                ["Batch Settlement v3", "Released", "Prakash", "Sprint 12", "100%", "Mar 28", "Completed"],
                ["App Timeout Config", "Released", "Sohail", "Sprint 11", "100%", "Mar 14", "Completed"],
                ["Processor Failover", "Released", "Prakash", "Sprint 11", "100%", "Mar 14", "Completed"]
              ],
              badges: {
                6: { "On Track": "success", "At Risk": "warning", "Delayed": "danger", "Completed": "neutral" }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Interactive Reporting Dashboard (Prioritization)",
          slug: "interactive-reporting-dashboard-prioritization",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Claude-powered agent for initial vetting and feasibility assessment of product prioritization requests.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Requests in Queue", value: "11", subtitle: "Awaiting prioritization" },
              { label: "Avg Review Time", value: "2.8 hrs", subtitle: "Per weekly cycle" },
              { label: "Decisions This Month", value: "8", subtitle: "Approved or deferred" },
              { label: "WeVend/Monex Split", value: "50/50", subtitle: "Balanced pipeline" }
            ],
            summary: "Eleven requests are queued for prioritization, with Prakash spending an average of 2.8 hours per weekly review cycle on manual vetting and feasibility analysis. Eight prioritization decisions were made this month with a balanced 50/50 split between WeVend and MonexGroup items. The Claude-powered agent would reduce initial vetting time by 50%, giving Prakash pre-analyzed recommendations instead of raw requests.",
            charts: [
              {
                id: "pm-priority-queue",
                title: "Request Queue Over Time",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Queue Size", data: [8,9,9,10,10,9,10,11,11,10,11,12,12,11,10,11,11,12,12,11,11,11] }
                  ]
                }
              },
              {
                id: "pm-priority-decisions",
                title: "Monthly Prioritization Decisions",
                type: "stacked-bar",
                data: {
                  labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr (partial)"],
                  datasets: [
                    { label: "Approved", data: [5, 4, 6, 5, 6, 3] },
                    { label: "Deferred", data: [3, 2, 4, 3, 2, 1] },
                    { label: "Rejected", data: [1, 1, 0, 1, 0, 0] }
                  ]
                }
              },
              {
                id: "pm-priority-by-source",
                title: "Requests by Source",
                type: "doughnut",
                data: {
                  labels: ["Sales", "Support", "Engineering", "Leadership", "Customer"],
                  datasets: [
                    { data: [4, 3, 2, 1, 1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Request", "Source", "BU", "RICE Score", "Effort (weeks)", "Submitted", "Status"],
              rows: [
                ["Multi-currency support", "Leadership", "WeVend", "85", "8", "Apr 6", "Evaluating"],
                ["Push notification alerts", "Sales", "MonexGroup", "72", "3", "Apr 3", "Evaluating"],
                ["Terminal grouping feature", "Support", "MonexGroup", "68", "4", "Apr 1", "Evaluating"],
                ["White-label admin portal", "Sales", "WeVend", "78", "10", "Mar 28", "Approved"],
                ["Offline transaction queue", "Engineering", "Both", "82", "6", "Mar 25", "Approved"],
                ["Custom receipt templates", "Customer", "MonexGroup", "55", "2", "Mar 22", "Deferred"],
                ["API rate limiting v2", "Engineering", "WeVend", "60", "3", "Mar 18", "Approved"],
                ["Dashboard dark mode", "Support", "Both", "35", "2", "Mar 15", "Deferred"],
                ["Processor health monitoring", "Sales", "MonexGroup", "74", "5", "Mar 12", "Approved"],
                ["Bulk terminal provisioning", "Sales", "WeVend", "80", "4", "Mar 9", "Approved"]
              ],
              badges: {
                6: { "Evaluating": "warning", "Approved": "success", "Deferred": "neutral", "Rejected": "danger" }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Interactive Reporting Dashboard (Dev/Project Updates)",
          slug: "interactive-reporting-dashboard-dev-project-updates",
          status: "Not Started",
          who: "Prakash, Sohail",
          weekly_hours: "~2 hrs",
          monthly_hours: "~8 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automate weekly dev and project updates by auto-pulling data from Jira.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Active Projects", value: "8", subtitle: "Across both BUs" },
              { label: "Sprint Completion", value: "78%", subtitle: "Sprint 13 average" },
              { label: "Report Time/Wk", value: "3.2 hrs", subtitle: "Prakash + Sohail combined" },
              { label: "Blockers", value: "2", subtitle: "Requiring escalation" }
            ],
            summary: "Eight projects are actively in development across both business units with Sprint 13 tracking at 78% completion. Prakash and Sohail spend a combined 3.2 hours per week compiling status updates, with 40% of that time pulling data from Jira and 25% on formatting. Two active blockers require escalation, both related to third-party processor integration delays.",
            charts: [
              {
                id: "pm-dev-burndown",
                title: "Sprint Burndown (story points remaining)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Remaining", data: [42,40,38,35,32,45,42,39,36,33,48,45,42,38,34,44,41,37,34,30,46,42] }
                  ]
                }
              },
              {
                id: "pm-dev-velocity-trend",
                title: "Velocity Trend (points/sprint)",
                type: "bar",
                data: {
                  labels: ["Sprint 8", "Sprint 9", "Sprint 10", "Sprint 11", "Sprint 12", "Sprint 13"],
                  datasets: [
                    { label: "Completed", data: [28, 32, 30, 35, 34, 36] },
                    { label: "Committed", data: [35, 38, 36, 40, 38, 46] }
                  ]
                }
              },
              {
                id: "pm-dev-ticket-status",
                title: "Jira Ticket Status Distribution",
                type: "doughnut",
                data: {
                  labels: ["Done", "In Progress", "In Review", "To Do", "Blocked"],
                  datasets: [
                    { data: [28, 12, 5, 8, 2] }
                  ]
                }
              },
              {
                id: "pm-dev-cycle-time",
                title: "Avg Cycle Time (days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Cycle Time", data: [4.8,4.5,4.2,4.6,4.3,4.1,4.4,4.0,4.3,3.9,4.5,4.2,3.8,4.1,3.7,4.0,3.8,3.6,3.9,3.5,3.8,3.6] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Project", "Owner", "Sprint", "Points Done", "Points Total", "Blockers", "Status"],
              rows: [
                ["Firmware OTA Updates", "Dev Team A", "Sprint 14", "18", "25", "0", "On Track"],
                ["Partner Portal SSO", "Dev Team B", "Sprint 15", "8", "20", "1", "At Risk"],
                ["Loyalty Points v2", "Dev Team A", "Sprint 13", "22", "25", "0", "On Track"],
                ["Receipt Customization API", "Dev Team C", "Sprint 14", "12", "18", "0", "On Track"],
                ["Terminal Health Dashboard", "Dev Team B", "Sprint 15", "5", "22", "1", "Delayed"],
                ["Offline Transaction Queue", "Dev Team C", "Sprint 15", "0", "15", "0", "Planned"],
                ["API Rate Limiting v2", "Dev Team A", "Sprint 14", "10", "12", "0", "On Track"],
                ["Bulk Terminal Provisioning", "Dev Team B", "Sprint 16", "0", "18", "0", "Planned"]
              ],
              badges: {
                6: { "On Track": "success", "At Risk": "warning", "Delayed": "danger", "Planned": "neutral" }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Auto-Generated Release Notes from GitHub",
          slug: "auto-generated-release-notes-from-github",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~1.1 hrs",
          monthly_hours: "~4.5 hrs",
          complexity: "Low",
          impact: "High",
          description: "Automatically generate release notes from GitHub commit history and PRs.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Releases (Mar)", value: "5", subtitle: "~1.25/week cadence" },
              { label: "Avg Write Time", value: "1.8 hrs", subtitle: "Target: 0.5 hrs" },
              { label: "PRs Merged", value: "34", subtitle: "Last 30 days" },
              { label: "Labeled PRs", value: "47%", subtitle: "Need 100% for automation" }
            ],
            summary: "Five releases shipped in March at a 1.25 per week cadence, each requiring 1.8 hours of manual release note writing by Prakash. Of the 34 PRs merged in the last 30 days, only 47% carry proper labels, which is the primary blocker for full automation. Once PR labeling conventions reach 100% adoption, the auto-generation pipeline can reduce write time from 1.8 hours to approximately 30 minutes per release.",
            charts: [
              {
                id: "pm-release-frequency",
                title: "Releases per Week",
                type: "bar",
                data: {
                  labels: ["Wk Mar 9", "Wk Mar 16", "Wk Mar 23", "Wk Mar 30", "Wk Apr 6"],
                  datasets: [
                    { label: "Releases", data: [1, 2, 1, 1, 1] }
                  ]
                }
              },
              {
                id: "pm-release-prs-merged",
                title: "PRs Merged per Day",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "PRs Merged", data: [2,1,3,2,1,2,3,1,2,3,1,2,2,1,3,2,1,2,1,3,2,1] }
                  ]
                }
              },
              {
                id: "pm-release-label-adoption",
                title: "PR Label Adoption (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Labeled %", data: [32,34,35,36,38,39,40,41,42,43,44,44,45,45,46,46,46,47,47,47,47,47] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Release", "Version", "Date", "PRs Included", "Labeled", "Write Time", "Status"],
              rows: [
                ["Terminal Firmware 4.2.1", "4.2.1", "Apr 4", "8", "4 (50%)", "1.8 hrs", "Published"],
                ["Cloud API 3.8.0", "3.8.0", "Mar 28", "6", "3 (50%)", "1.5 hrs", "Published"],
                ["Mobile App 2.5.0", "2.5.0", "Mar 24", "5", "2 (40%)", "2.0 hrs", "Published"],
                ["Admin Portal 1.12.0", "1.12.0", "Mar 20", "7", "3 (43%)", "1.8 hrs", "Published"],
                ["Terminal Firmware 4.2.0", "4.2.0", "Mar 13", "8", "4 (50%)", "2.0 hrs", "Published"],
                ["Cloud API 3.7.2", "3.7.2", "Mar 7", "4", "1 (25%)", "1.5 hrs", "Published"]
              ],
              badges: {
                6: { "Published": "success", "Draft": "warning", "Pending Review": "info" }
              }
            }
          }
        },
        {
          rank: 6,
          name: "AI-Assisted PRD Writing",
          slug: "ai-assisted-prd-writing",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~2.1 hrs",
          monthly_hours: "~8.5 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Continue refining Claude-powered PRD writing skill to reduce creation time to under 1 hour per PRD.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "PRDs This Month", value: "6", subtitle: "5-6/month average" },
              { label: "Avg Creation Time", value: "2.4 hrs", subtitle: "Target: <1 hr" },
              { label: "Revision Cycles", value: "1.8", subtitle: "Per PRD average" },
              { label: "Cowork Skill Usage", value: "100%", subtitle: "All PRDs use skill" }
            ],
            summary: "Six PRDs were produced this month using the Cowork skill at an average of 2.4 hours each, down from 3+ hours without the skill but still above the sub-1-hour target. Revision cycles average 1.8 per PRD, primarily driven by stakeholder feedback incorporation that the skill does not yet handle. All PRDs now use the WeVend PRD Generator skill at 100% adoption.",
            charts: [
              {
                id: "pm-prd-creation-time",
                title: "PRD Creation Time Trend (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Hours per PRD", data: [3.0,0,0,2.8,0,0,2.6,0,0,2.5,0,0,2.4,0,0,2.3,0,0,2.2,0,2.4,0] }
                  ]
                }
              },
              {
                id: "pm-prd-revisions",
                title: "Revision Cycles per PRD",
                type: "bar",
                data: {
                  labels: ["Multi-currency", "OTA Updates", "Partner SSO", "Loyalty v2", "Receipt API", "Health Dash"],
                  datasets: [
                    { label: "Revisions", data: [2, 1, 3, 1, 2, 2] }
                  ]
                }
              },
              {
                id: "pm-prd-section-time",
                title: "Time by PRD Section (avg hrs)",
                type: "horizontal-bar",
                data: {
                  labels: ["Problem Statement", "Requirements", "User Stories", "Technical Spec", "Success Criteria", "Stakeholder Review"],
                  datasets: [
                    { label: "Hours", data: [0.2, 0.5, 0.4, 0.6, 0.2, 0.5] }
                  ]
                }
              }
            ],
            table: {
              columns: ["PRD", "Feature", "Created", "Time (hrs)", "Revisions", "Sections", "Status"],
              rows: [
                ["PRD-042", "Multi-currency Support", "Apr 6", "2.4", "2", "8/8", "In Review"],
                ["PRD-041", "Terminal Health Dashboard", "Apr 1", "2.2", "2", "8/8", "Approved"],
                ["PRD-040", "Receipt Customization API", "Mar 27", "2.3", "2", "8/8", "Approved"],
                ["PRD-039", "Partner Portal SSO", "Mar 23", "2.4", "3", "8/8", "Approved"],
                ["PRD-038", "Loyalty Points v2", "Mar 18", "2.5", "1", "8/8", "Approved"],
                ["PRD-037", "Firmware OTA Updates", "Mar 12", "2.8", "1", "8/8", "Approved"],
                ["PRD-036", "Batch Settlement v3", "Mar 9", "3.0", "2", "8/8", "Approved"]
              ],
              badges: {
                6: { "In Review": "warning", "Approved": "success", "Draft": "neutral" }
              }
            }
          }
        },
        {
          rank: 7,
          name: "AI-Assisted User/Admin Guide Creation",
          slug: "ai-assisted-user-admin-guide-creation",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~1.6 hrs",
          monthly_hours: "~6.5 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Use Claude to accelerate user/admin guide creation from source documents.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Guides This Month", value: "5", subtitle: "3 user + 2 admin" },
              { label: "Avg Creation Time", value: "3.2 hrs", subtitle: "Target: 2 hrs" },
              { label: "Source Docs Used", value: "4.2", subtitle: "Avg per guide" },
              { label: "Cowork Assisted", value: "100%", subtitle: "All guides use Cowork" }
            ],
            summary: "Five guides were produced this month at an average of 3.2 hours each, still above the 2-hour target. Cowork handles the heaviest portion of source material gathering from an average of 4.2 documents per guide, saving roughly 1.5 hours per guide. The remaining gap to the 2-hour target requires improved draft generation quality so Prakash spends less time on technical accuracy review.",
            charts: [
              {
                id: "pm-guide-creation-time",
                title: "Guide Creation Time (hrs)",
                type: "bar",
                data: {
                  labels: ["User: OTA", "Admin: OTA", "User: Loyalty v2", "Admin: Settlement", "User: Receipt API"],
                  datasets: [
                    { label: "Total Time", data: [3.0, 3.5, 2.8, 3.8, 3.0] },
                    { label: "Cowork Saved", data: [1.5, 1.8, 1.2, 2.0, 1.5] }
                  ]
                }
              },
              {
                id: "pm-guide-monthly-output",
                title: "Monthly Guide Output",
                type: "line",
                data: {
                  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr (proj)"],
                  datasets: [
                    { label: "Guides Produced", data: [4, 5, 3, 5, 6, 5, 6] }
                  ]
                }
              },
              {
                id: "pm-guide-type-split",
                title: "Guide Type Distribution",
                type: "doughnut",
                data: {
                  labels: ["User Guide", "Admin Guide", "API Reference", "Quick Start"],
                  datasets: [
                    { data: [12, 8, 4, 3] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Guide", "Type", "Feature", "Created", "Time (hrs)", "Pages", "Status"],
              rows: [
                ["Receipt API User Guide", "User", "Receipt Customization", "Apr 5", "3.0", "12", "In Review"],
                ["Settlement Admin Guide", "Admin", "Batch Settlement v3", "Mar 30", "3.8", "18", "Published"],
                ["Loyalty v2 User Guide", "User", "Loyalty Points v2", "Mar 25", "2.8", "14", "Published"],
                ["OTA Admin Guide", "Admin", "Firmware OTA Updates", "Mar 20", "3.5", "16", "Published"],
                ["OTA User Guide", "User", "Firmware OTA Updates", "Mar 18", "3.0", "10", "Published"],
                ["App Timeout Quick Start", "Quick Start", "App Timeout Config", "Mar 14", "1.5", "4", "Published"],
                ["Failover Admin Guide", "Admin", "Processor Failover", "Mar 10", "3.6", "15", "Published"]
              ],
              badges: {
                6: { "Published": "success", "In Review": "warning", "Draft": "neutral" }
              }
            }
          }
        },
        {
          rank: 8,
          name: "Automated Teams-to-Confluence Meeting Notes",
          slug: "automated-teams-to-confluence-meeting-notes",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Automatically sync meeting notes from Teams to Confluence, eliminating manual copy-paste.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Meetings/Week", value: "9", subtitle: "Avg across last month" },
              { label: "Manual Transfer Time", value: "1.5 hrs/wk", subtitle: "~10 min per meeting" },
              { label: "Notes in Confluence", value: "36", subtitle: "Last 30 days" },
              { label: "Missed/Late Notes", value: "4", subtitle: "Due to time pressure" }
            ],
            summary: "Prakash attended an average of 9 meetings per week over the past month, manually transferring notes to Confluence at roughly 10 minutes each for a total of 1.5 hours per week. Thirty-six meeting notes were posted but 4 were delayed or missed entirely due to competing priorities. A Power Automate flow would eliminate the manual transfer completely, as Prakash confirmed no review step is needed.",
            charts: [
              {
                id: "pm-meetings-weekly",
                title: "Meetings per Day",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Meetings", data: [2,1,2,3,1,2,2,1,2,2,1,2,3,1,2,2,1,2,2,2,1,2] }
                  ]
                }
              },
              {
                id: "pm-meetings-transfer-time",
                title: "Weekly Transfer Time (min)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Minutes", data: [20,10,20,30,10,20,20,10,20,20,10,20,30,10,20,20,10,20,20,20,10,20] }
                  ]
                }
              },
              {
                id: "pm-meetings-by-type",
                title: "Meeting Type Distribution",
                type: "doughnut",
                data: {
                  labels: ["Sprint Planning", "Standup", "Stakeholder", "Design Review", "Ad Hoc"],
                  datasets: [
                    { data: [4, 12, 8, 6, 6] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Meeting", "Type", "Date", "Attendees", "Duration", "Notes Posted", "Status"],
              rows: [
                ["Sprint 14 Planning", "Sprint Planning", "Apr 7", "6", "60 min", "Yes", "Posted"],
                ["Product Standup", "Standup", "Apr 7", "4", "15 min", "Yes", "Posted"],
                ["Leadership Review", "Stakeholder", "Apr 3", "5", "45 min", "Yes", "Posted"],
                ["OTA Design Review", "Design Review", "Apr 2", "7", "60 min", "Yes", "Posted"],
                ["Sales Feature Request", "Ad Hoc", "Apr 1", "3", "30 min", "No", "Missed"],
                ["Sprint 13 Retro", "Sprint Planning", "Mar 31", "6", "45 min", "Yes", "Posted"],
                ["Product Standup", "Standup", "Mar 30", "4", "15 min", "Yes", "Posted"],
                ["Processor Integration", "Design Review", "Mar 27", "5", "60 min", "Yes", "Late"],
                ["Customer Feedback", "Ad Hoc", "Mar 25", "3", "30 min", "No", "Missed"],
                ["SSO Architecture", "Design Review", "Mar 24", "6", "60 min", "Yes", "Posted"]
              ],
              badges: {
                6: { "Posted": "success", "Late": "warning", "Missed": "danger" }
              }
            }
          }
        },
        {
          rank: 9,
          name: "Self-Serve Product Knowledge Base",
          slug: "self-serve-product-knowledge-base",
          status: "Not Started",
          who: "Prakash",
          weekly_hours: "~0.4 hrs",
          monthly_hours: "~1.6 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Build a searchable knowledge base that Sales and Support can query directly, reducing ad hoc inquiries to PM.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Weekly Inquiries", value: "8", subtitle: "To Prakash directly" },
              { label: "Answerable from Docs", value: "~70%", subtitle: "Estimated from existing content" },
              { label: "Prakash Time/Wk", value: "1.5 hrs", subtitle: "Responding to ad hoc" },
              { label: "Confluence Articles", value: "84", subtitle: "Existing but unsearchable" }
            ],
            summary: "Prakash fields approximately 8 ad hoc product inquiries per week from Sales and Support, spending 1.5 hours on responses. An estimated 70% of these questions are answerable from the 84 existing Confluence articles, but teams default to direct messages because the documentation is poorly organized and not searchable. A Claude-powered Q&A agent could deflect 5-6 of these inquiries per week.",
            charts: [
              {
                id: "pm-kb-inquiries",
                title: "Weekly Ad Hoc Inquiries",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Inquiries", data: [1,2,1,0,2,1,1,2,1,1,2,0,1,2,1,1,2,1,1,0,2,1] }
                  ]
                }
              },
              {
                id: "pm-kb-inquiry-category",
                title: "Inquiry Categories",
                type: "doughnut",
                data: {
                  labels: ["Feature Availability", "Technical Specs", "Pricing/Packaging", "Troubleshooting", "Integration"],
                  datasets: [
                    { data: [12, 8, 6, 5, 3] }
                  ]
                }
              },
              {
                id: "pm-kb-response-time",
                title: "Response Time (hours)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Response Time", data: [2.5,1.8,3.2,0,1.5,2.8,2.0,1.2,3.5,2.2,1.8,0,2.5,1.5,3.0,2.2,1.8,2.8,1.5,0,2.0,1.8] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Inquiry", "From", "Team", "Category", "Time to Answer", "In Docs?", "Status"],
              rows: [
                ["Does terminal support NFC?", "Sales Rep", "Sales", "Technical Specs", "1.5 hrs", "Yes", "Answered"],
                ["Loyalty v2 release date?", "Support Lead", "Support", "Feature Availability", "0.5 hrs", "No", "Answered"],
                ["Multi-currency pricing?", "Sales Rep", "Sales", "Pricing/Packaging", "2.0 hrs", "Partial", "Answered"],
                ["Terminal offline behavior?", "Support Agent", "Support", "Troubleshooting", "1.0 hrs", "Yes", "Answered"],
                ["API rate limits?", "Partner", "Sales", "Technical Specs", "3.0 hrs", "Yes", "Answered"],
                ["Settlement file format?", "Support Agent", "Support", "Integration", "1.5 hrs", "Yes", "Answered"],
                ["Can we white-label the app?", "Sales Rep", "Sales", "Feature Availability", "2.5 hrs", "No", "Answered"],
                ["Processor failover behavior?", "Support Lead", "Support", "Troubleshooting", "1.8 hrs", "Yes", "Answered"]
              ],
              badges: {
                6: { "Answered": "success", "Pending": "warning", "Escalated": "info" }
              }
            }
          }
        },
        {
          rank: 10,
          name: "PM Scoping Templates & Checklists (Sohail)",
          slug: "pm-scoping-templates-checklists-sohail",
          status: "Not Started",
          who: "Sohail",
          weekly_hours: "~3.5 hrs",
          monthly_hours: "~14 hrs",
          complexity: "Low",
          impact: "High",
          description: "Standardized scoping templates for the multi-layer unattended payments ecosystem.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Projects Scoped (Mar)", value: "7", subtitle: "6-8/month average" },
              { label: "Avg Scoping Time", value: "3.1 hrs", subtitle: "Target: 1.5 hrs" },
              { label: "Scope Changes/Sprint", value: "2.4", subtitle: "Last 3 sprints avg" },
              { label: "Layers per Project", value: "3.8", subtitle: "Terminal, app, cloud, processor" }
            ],
            summary: "Sohail scoped 7 projects in March at an average of 3.1 hours each, well above the 1.5-hour target after templates are adopted. Scope changes averaged 2.4 per sprint over the last 3 sprints, with most traced to missed requirements in the cloud and processor layers. The average project spans 3.8 of the 5 ecosystem layers, confirming the need for multi-layer checklists to prevent gaps.",
            charts: [
              {
                id: "pm-scoping-time-trend",
                title: "Scoping Time per Project (hrs)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Scoping Time", data: [3.5,0,0,3.2,0,2.8,0,0,3.4,0,3.0,0,0,2.9,0,3.1,0,0,3.3,0,2.8,0] }
                  ]
                }
              },
              {
                id: "pm-scoping-scope-changes",
                title: "Mid-Sprint Scope Changes",
                type: "bar",
                data: {
                  labels: ["Sprint 8", "Sprint 9", "Sprint 10", "Sprint 11", "Sprint 12", "Sprint 13"],
                  datasets: [
                    { label: "Scope Changes", data: [4, 3, 3, 2, 3, 2] }
                  ]
                }
              },
              {
                id: "pm-scoping-layer-coverage",
                title: "Layer Coverage per Project",
                type: "stacked-bar",
                data: {
                  labels: ["Multi-currency", "OTA Updates", "Partner SSO", "Loyalty v2", "Receipt API", "Health Dash", "Offline Queue"],
                  datasets: [
                    { label: "Terminal", data: [1, 1, 0, 1, 1, 1, 1] },
                    { label: "Firmware", data: [0, 1, 0, 0, 0, 1, 1] },
                    { label: "App", data: [1, 1, 1, 1, 1, 1, 1] },
                    { label: "Cloud", data: [1, 1, 1, 1, 1, 1, 1] },
                    { label: "Processor", data: [1, 0, 0, 0, 0, 0, 1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Project", "Scoped By", "Date", "Time (hrs)", "Layers", "Scope Changes", "Status"],
              rows: [
                ["Multi-currency Support", "Sohail", "Apr 6", "2.8", "4", "0", "Scoping"],
                ["Offline Transaction Queue", "Sohail", "Apr 2", "3.3", "5", "0", "Scoped"],
                ["Terminal Health Dashboard", "Sohail", "Mar 30", "3.1", "4", "1", "In Sprint"],
                ["Receipt Customization API", "Sohail", "Mar 26", "2.9", "4", "0", "In Sprint"],
                ["Partner Portal SSO", "Sohail", "Mar 23", "3.0", "3", "1", "In Sprint"],
                ["Loyalty Points v2", "Sohail", "Mar 16", "2.8", "3", "0", "In Sprint"],
                ["Firmware OTA Updates", "Sohail", "Mar 12", "3.2", "4", "1", "In Sprint"],
                ["Batch Settlement v3", "Sohail", "Mar 9", "3.5", "4", "2", "Completed"],
                ["API Rate Limiting v2", "Sohail", "Mar 5", "2.5", "3", "0", "In Sprint"]
              ],
              badges: {
                6: { "Scoping": "warning", "Scoped": "info", "In Sprint": "info", "Completed": "success" }
              }
            }
          }
        }
      ],
    },

    // === SALES OPERATIONS ===
    {
      name: "Sales Operations",
      slug: "sales-operations",
      priorities: [
        {
          rank: 1,
          name: "Eliminate Duplicate Data Entry Across Merchant Onboarding",
          slug: "eliminate-duplicate-data-entry-across-merchant-onboarding",
          status: "In Progress",
          who: "Admin team, Roxana",
          weekly_hours: "Variable",
          monthly_hours: "~167 hrs",
          complexity: "Medium-High",
          impact: "High",
          description: "Remove re-keying of merchant data across Jotform, SharePoint, WeTrack, and Fiserv Co-Pilot via phased automation.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Minutes Saved per Merchant", value: "52", subtitle: "Target: 65-70 min savings" },
              { label: "Merchants Processed/Month", value: "187", subtitle: "Up from 162 last month" },
              { label: "Phase A Completion", value: "78%", subtitle: "WeCenter intake form live" },
              { label: "Monthly Hours Recovered", value: "142", subtitle: "Targeting 167 hrs/month" }
            ],
            summary: "Duplicate data entry elimination is progressing well with 142 hours recovered monthly, approaching the 167-hour target. Phase A automation (WeCenter to WeTrack) is 78% complete and handling 187 merchants per month. The Co-Pilot API integration for Phase B remains the key dependency for achieving the full 65-70 minute per-merchant savings.",
            charts: [
              {
                id: "so-merchant-processing-time",
                title: "Average Processing Time per Merchant (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Actual Time", data: [68,65,63,61,58,55,53,50,48,46,44,42,40,38,36,34,32,30,28,26,24,22] },
                    { label: "Target Time", data: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20] }
                  ]
                }
              },
              {
                id: "so-phase-progress",
                title: "Automation Phase Completion",
                type: "doughnut",
                data: {
                  labels: ["Phase A Complete","Phase A Remaining","Phase B Planned","Phase C Planned"],
                  datasets: [{ data: [78,22,0,0] }]
                }
              },
              {
                id: "so-monthly-hours-recovered",
                title: "Monthly Hours Recovered by Phase",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Phase A Savings", data: [3.2,3.4,3.5,3.8,4.0,4.2,4.5,4.8,5.0,5.2,5.5,5.8,6.0,6.2,6.4,6.5,6.8,7.0,7.2,7.4,7.5,7.8] },
                    { label: "Phase B Savings", data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["System","Status","Re-Keys Eliminated","Avg Time Saved","Error Rate"],
              rows: [
                ["WeCenter Intake Form","Live","892","18 min","0.3%"],
                ["WeTrack Auto-Population","Live","764","12 min","0.5%"],
                ["Contract Auto-Generation","Testing","210","8 min","1.2%"],
                ["DocuSign Integration","Live","685","6 min","0.2%"],
                ["Co-Pilot API","Pending","0","0 min","N/A"],
                ["Gateway Sync","In Progress","142","4 min","0.8%"],
                ["Cashub Parameter File","Planned","0","0 min","N/A"],
                ["TID Ordering","Blocked","0","0 min","N/A"]
              ],
              badges: {
                1: {
                  "Live": "success",
                  "Testing": "warning",
                  "In Progress": "info",
                  "Pending": "neutral",
                  "Planned": "neutral",
                  "Blocked": "danger"
                }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Automate Partner Onboarding Steps",
          slug: "automate-partner-onboarding-steps",
          status: "Not Started",
          who: "Admin team",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "High",
          description: "When a partner is approved, auto-create records in WeTrack, provision WeCenter access, generate intake forms, and send welcome packages.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Active Partners", value: "6", subtitle: "Target: 7-8 within 30 days" },
              { label: "Avg Onboarding Time", value: "4.2 days", subtitle: "Down from 6.5 days" },
              { label: "Manual Steps Remaining", value: "2 of 5", subtitle: "3 steps automated" },
              { label: "Hours Saved per Partner", value: "3.8", subtitle: "Target: 5 hrs/partner" }
            ],
            summary: "Partner onboarding automation has reduced 3 of 5 manual steps, cutting average onboarding time from 6.5 to 4.2 days. With 6 active partners and 7-8 expected within 30 days, the 3.8 hours saved per partner is approaching the 5-hour target. WeCenter provisioning and Jotform generation remain the two manual steps needing automation.",
            charts: [
              {
                id: "so-partner-onboarding-time",
                title: "Partner Onboarding Duration (Days)",
                type: "bar",
                data: {
                  labels: ["Partner A","Partner B","Partner C","Partner D","Partner E","Partner F"],
                  datasets: [
                    { label: "Onboarding Days", data: [6.5,5.8,5.2,4.8,4.2,3.9] }
                  ]
                }
              },
              {
                id: "so-onboarding-steps-automated",
                title: "Onboarding Step Automation Status",
                type: "doughnut",
                data: {
                  labels: ["Automated","In Progress","Manual"],
                  datasets: [{ data: [3,1,1] }]
                }
              },
              {
                id: "so-partner-growth-trend",
                title: "Active Partner Count Over Time",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Active Partners", data: [4,4,4,4,4,4,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Partner","Status","Onboarding Date","Days to Complete","Steps Automated","Pending Items"],
              rows: [
                ["Alpha Vending","Active","Mar 2","6.5","3/5","None"],
                ["Metro Kiosks","Active","Mar 8","5.8","3/5","None"],
                ["QuickPay Systems","Active","Mar 14","5.2","4/5","None"],
                ["NorthPoint Retail","Active","Mar 19","4.8","4/5","None"],
                ["Coastal Merchants","Active","Mar 25","4.2","4/5","None"],
                ["Summit Processing","In Progress","Apr 1","3.9","4/5","WeCenter Access"],
                ["Pacific Payments","Pending","Apr 5","N/A","N/A","Agreement Review"],
                ["LakeView Partners","Queued","Apr 8","N/A","N/A","Intake Form"]
              ],
              badges: {
                1: {
                  "Active": "success",
                  "In Progress": "info",
                  "Pending": "warning",
                  "Queued": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Replace Spreadsheet Status Tracking with Real-Time Dashboard",
          slug: "replace-spreadsheet-status-tracking-with-real-time-dashboard",
          status: "Not Started",
          who: "Roxana, Admin team",
          weekly_hours: "~3 hrs",
          monthly_hours: "~12 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Partners see live merchant onboarding status in WeCenter instead of manually updated spreadsheets.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Spreadsheets Maintained", value: "5", subtitle: "Down from daily manual updates" },
              { label: "Weekly Status Calls", value: "4", subtitle: "Target: reduce to 1-2" },
              { label: "Daily Maintenance Time", value: "42 min", subtitle: "Was 60 min/day" },
              { label: "Partner Satisfaction", value: "4.1/5", subtitle: "Up from 3.4/5" }
            ],
            summary: "Spreadsheet maintenance time has dropped from 60 to 42 minutes daily, and partner satisfaction has improved from 3.4 to 4.1 out of 5. The 5 active spreadsheets are still being maintained manually while WeCenter dashboard development continues. Weekly status calls remain at 4 per week with a target of reducing to 1-2 once live dashboards are available.",
            charts: [
              {
                id: "so-spreadsheet-time",
                title: "Daily Spreadsheet Maintenance (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Minutes Spent", data: [58,62,55,60,57,54,52,48,50,46,44,48,45,42,44,40,43,41,38,42,40,42] }
                  ]
                }
              },
              {
                id: "so-status-inquiries",
                title: "Inbound Status Inquiries by Channel",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Email", data: [8,7,9,6,8,7,6,5,7,6,5,6,4,5,4,3,4,3,4,3,3,3] },
                    { label: "Phone", data: [5,6,4,5,4,5,4,3,4,3,3,3,2,3,2,2,3,2,2,2,2,2] },
                    { label: "Status Call", data: [2,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] }
                  ]
                }
              },
              {
                id: "so-partner-satisfaction",
                title: "Partner Satisfaction Score Trend",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Satisfaction Score", data: [3.4,3.4,3.5,3.5,3.6,3.6,3.7,3.7,3.8,3.8,3.8,3.9,3.9,3.9,4.0,4.0,4.0,4.0,4.1,4.1,4.1,4.1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Partner","Spreadsheet Status","Last Updated","Merchants Tracked","Open Inquiries","Dashboard Ready"],
              rows: [
                ["Alpha Vending","Active","Apr 7","34","2","No"],
                ["Metro Kiosks","Active","Apr 7","28","1","No"],
                ["QuickPay Systems","Active","Apr 7","22","3","No"],
                ["NorthPoint Retail","Active","Apr 6","18","0","Planned"],
                ["Coastal Merchants","Active","Apr 7","15","2","Planned"],
                ["Summit Processing","New","Apr 5","8","1","Planned"]
              ],
              badges: {
                5: {
                  "No": "danger",
                  "Planned": "warning",
                  "Yes": "success"
                }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Automate Welcome Letters and Notifications",
          slug: "automate-welcome-letters-and-notifications",
          status: "Not Started",
          who: "Admin team",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "Medium",
          description: "Auto-send populated welcome communications and internal handoff notifications when merchants reach status milestones.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Welcome Letters Sent", value: "156", subtitle: "This month automated" },
              { label: "Avg Handoff Delay", value: "1.4 hrs", subtitle: "Down from 8+ hours" },
              { label: "Minutes Saved/Merchant", value: "12", subtitle: "Target: 15 min" },
              { label: "Missed Notifications", value: "3", subtitle: "Down from 18 last month" }
            ],
            summary: "Welcome letter automation has sent 156 communications this month with average handoff delays reduced from over 8 hours to 1.4 hours. The 12 minutes saved per merchant is approaching the 15-minute target. Missed notifications have dropped from 18 to just 3, significantly improving the merchant onboarding experience.",
            charts: [
              {
                id: "so-welcome-volume",
                title: "Welcome Letters Sent (Daily)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Letters Sent", data: [5,7,8,6,9,7,8,10,6,8,7,9,8,7,10,8,9,7,8,6,9,8] }
                  ]
                }
              },
              {
                id: "so-handoff-delay",
                title: "Average Handoff Delay (Hours)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Handoff Delay", data: [8.2,7.5,6.8,6.1,5.5,5.0,4.6,4.2,3.8,3.5,3.2,2.9,2.6,2.4,2.2,2.0,1.9,1.8,1.6,1.5,1.4,1.4] }
                  ]
                }
              },
              {
                id: "so-notification-types",
                title: "Notification Types Distribution",
                type: "doughnut",
                data: {
                  labels: ["Welcome Letters","DocuSign Complete","Deployment Ready","Credential Sync","Cashub Ready"],
                  datasets: [{ data: [156,142,98,87,64] }]
                }
              }
            ],
            table: {
              columns: ["Notification Type","Trigger","Volume (Month)","Avg Delay","Status"],
              rows: [
                ["Welcome Letter","Merchant Approved","156","0.5 hrs","Automated"],
                ["DocuSign Complete","Signature Received","142","0.2 hrs","Automated"],
                ["Deployment Ready","Cashub Params Set","98","1.2 hrs","Semi-Auto"],
                ["Credential Sync","Gateway Live","87","2.1 hrs","Semi-Auto"],
                ["Cashub Ready","Parameter File Done","64","3.4 hrs","Manual"],
                ["Partner Welcome","Partner Approved","6","4.2 hrs","Manual"],
                ["Rate Change Notice","Rate Updated","23","1.8 hrs","Semi-Auto"],
                ["Internal Handoff","Stage Change","312","1.4 hrs","Automated"]
              ],
              badges: {
                4: {
                  "Automated": "success",
                  "Semi-Auto": "warning",
                  "Manual": "danger"
                }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Standardize and Document Billing Logic",
          slug: "standardize-and-document-billing-logic",
          status: "Not Started",
          who: "Layal",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Low",
          impact: "High",
          description: "Create centralized billing logic spec document for each partner's configuration, replacing verbal handoffs.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Partners Documented", value: "4 of 10", subtitle: "40% complete" },
              { label: "Billing Variations", value: "7", subtitle: "Across all partners" },
              { label: "Payout Errors (Month)", value: "1", subtitle: "Down from 4 last quarter" },
              { label: "Avg Documentation Time", value: "45 min", subtitle: "Per partner spec" }
            ],
            summary: "Billing logic documentation is 40% complete with 4 of 10 partners fully documented. The 7 billing variations identified include revenue share, fee splits, markup structures, and SaaS pass-throughs. Payout errors have dropped from 4 per quarter to just 1 this month since standardization began, validating the compliance risk reduction.",
            charts: [
              {
                id: "so-billing-doc-progress",
                title: "Partner Documentation Progress",
                type: "horizontal-bar",
                data: {
                  labels: ["Alpha Vending","Metro Kiosks","QuickPay","NorthPoint","Coastal","Summit","Pacific","LakeView","Horizon","Peak"],
                  datasets: [
                    { label: "% Documented", data: [100,100,100,100,60,40,20,0,0,0] }
                  ]
                }
              },
              {
                id: "so-payout-errors",
                title: "Monthly Payout Errors",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Errors Found", data: [1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Partner","Billing Model","Rev Share %","Documentation Status","Last Reviewed","Discrepancies"],
              rows: [
                ["Alpha Vending","Revenue Share","18%","Complete","Apr 5","0"],
                ["Metro Kiosks","Fee Split","22%","Complete","Apr 3","0"],
                ["QuickPay Systems","Markup","15%","Complete","Apr 1","1"],
                ["NorthPoint Retail","Revenue Share","20%","Complete","Mar 28","0"],
                ["Coastal Merchants","SaaS Pass-through","N/A","In Progress","Mar 25","2"],
                ["Summit Processing","Fee Split","17%","In Progress","Mar 22","1"],
                ["Pacific Payments","Revenue Share","19%","Started","N/A","Unknown"],
                ["LakeView Partners","Markup","16%","Not Started","N/A","Unknown"],
                ["Horizon Group","Fee Split","21%","Not Started","N/A","Unknown"],
                ["Peak Solutions","Revenue Share","18%","Not Started","N/A","Unknown"]
              ],
              badges: {
                3: {
                  "Complete": "success",
                  "In Progress": "warning",
                  "Started": "info",
                  "Not Started": "danger"
                }
              }
            }
          }
        },
        {
          rank: 6,
          name: "Streamline Add-On Terminal Process",
          slug: "streamline-add-on-terminal-process",
          status: "Not Started",
          who: "Roxana",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "Medium",
          description: "Automate add-on terminal intake and TID ordering to handle growing volume without manual Roxana involvement.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Add-On Requests/Month", value: "28", subtitle: "Up from 22 last month" },
              { label: "Avg Processing Time", value: "22 min", subtitle: "Down from 38 min" },
              { label: "Jotform Self-Submit Rate", value: "64%", subtitle: "Target: 90%" },
              { label: "Pre-Ordered TIDs Available", value: "45", subtitle: "Spare inventory buffer" }
            ],
            summary: "Add-on terminal requests have grown to 28 per month with processing time reduced from 38 to 22 minutes through Jotform self-submission. The 64% self-submit rate is progressing toward the 90% target. The pre-ordered TID inventory of 45 spare units has eliminated Co-Pilot ordering for most add-on requests, saving significant admin time.",
            charts: [
              {
                id: "so-addon-volume",
                title: "Add-On Terminal Requests (Daily)",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Requests", data: [1,2,1,0,2,1,1,2,1,1,2,1,0,2,1,2,1,1,2,0,1,2] }
                  ]
                }
              },
              {
                id: "so-addon-processing",
                title: "Processing Time per Request (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Processing Time", data: [38,36,35,34,32,31,30,29,28,27,26,25,25,24,24,23,23,22,22,22,22,22] }
                  ]
                }
              },
              {
                id: "so-addon-method",
                title: "Request Submission Method",
                type: "doughnut",
                data: {
                  labels: ["Jotform Self-Submit","Manual via Roxana","Email Request"],
                  datasets: [{ data: [64,24,12] }]
                }
              }
            ],
            table: {
              columns: ["Request ID","Merchant","Type","Terminals","Method","Status","Processing Time"],
              rows: [
                ["ADD-041","Fresh Snacks Co","Additional Unit","2","Jotform","Complete","18 min"],
                ["ADD-040","Metro Wash LLC","Replacement","1","Jotform","Complete","15 min"],
                ["ADD-039","Park-n-Go","Additional Unit","3","Manual","Complete","35 min"],
                ["ADD-038","QuickBite Vending","Upgrade","1","Jotform","Complete","20 min"],
                ["ADD-037","CleanWave Laundry","Additional Unit","2","Email","In Progress","Pending"],
                ["ADD-036","EV Charge Plus","Additional Unit","4","Jotform","Complete","22 min"],
                ["ADD-035","Snack Attack","Replacement","1","Jotform","Complete","16 min"],
                ["ADD-034","AquaVend","Additional Unit","2","Manual","Complete","32 min"]
              ],
              badges: {
                5: {
                  "Complete": "success",
                  "In Progress": "warning",
                  "Pending": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Partner Training Phase Efficiency",
          slug: "partner-training-phase-efficiency",
          status: "Not Started",
          who: "Ops/Training team",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "Medium",
          description: "Improve training scheduling, access creation, and sign-off processes (cross-departmental).",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Avg Training Cycle", value: "5.2 days", subtitle: "Down from 7.8 days" },
              { label: "Partners Trained (Month)", value: "3", subtitle: "All completed on time" },
              { label: "Self-Service Bookings", value: "67%", subtitle: "Via Calendly pilot" },
              { label: "Access Provisioning Time", value: "2.1 hrs", subtitle: "Down from 4.5 hrs" }
            ],
            summary: "Partner training cycle time has improved from 7.8 to 5.2 days with the Calendly pilot enabling 67% self-service scheduling. Access provisioning time has been cut from 4.5 to 2.1 hours by tying gateway and Cashub access creation into the onboarding workflow. All 3 partners trained this month completed on schedule.",
            charts: [
              {
                id: "so-training-cycle",
                title: "Training Cycle Time by Partner (Days)",
                type: "bar",
                data: {
                  labels: ["Alpha Vending","Metro Kiosks","QuickPay","NorthPoint","Coastal","Summit"],
                  datasets: [
                    { label: "Cycle Time", data: [7.8,7.2,6.5,5.8,5.4,5.2] }
                  ]
                }
              },
              {
                id: "so-training-satisfaction",
                title: "Partner Training Satisfaction Over Time",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Satisfaction (1-5)", data: [3.2,3.2,3.3,3.4,3.4,3.5,3.5,3.6,3.6,3.7,3.7,3.8,3.8,3.9,3.9,4.0,4.0,4.1,4.1,4.2,4.2,4.2] }
                  ]
                }
              },
              {
                id: "so-training-scheduling",
                title: "Scheduling Method Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Calendly Self-Service","Manual Coordination","Email Back-and-Forth"],
                  datasets: [{ data: [67,22,11] }]
                }
              }
            ],
            table: {
              columns: ["Training Phase","Owner","Avg Duration","Automated","Bottleneck"],
              rows: [
                ["Scheduling","Ops/Training","0.5 days","Yes (Calendly)","None"],
                ["Gateway Access Setup","Admin","0.8 days","Partial","API provisioning"],
                ["Cashub Access Setup","Admin","0.6 days","Partial","Manual credentials"],
                ["Product Training","Training Team","1.5 days","No","Trainer availability"],
                ["Integration Review","Integrations","1.2 days","No","Team scheduling"],
                ["Satisfaction Sign-off","Partner","0.6 days","Partial","Partner response time"]
              ],
              badges: {
                3: {
                  "Yes (Calendly)": "success",
                  "Partial": "warning",
                  "No": "danger"
                }
              }
            }
          }
        },
        {
          rank: 8,
          name: "Residual Audit Automation",
          slug: "residual-audit-automation",
          status: "Not Started",
          who: "Layal",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "High",
          description: "Automated reconciliation of acquirer residual payout files against expected calculations with discrepancy flagging.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Monthly Residual Volume", value: "$284K", subtitle: "Across all acquirers" },
              { label: "Discrepancies Found", value: "7", subtitle: "This audit cycle" },
              { label: "Revenue Recovered", value: "$4,280", subtitle: "From flagged errors" },
              { label: "Audit Time", value: "3.2 hrs", subtitle: "Down from 12+ hrs" }
            ],
            summary: "Residual audit automation has reduced monthly audit time from 12+ hours to 3.2 hours while processing $284K in residual volume. The system found 7 discrepancies this cycle, recovering $4,280 in underpayments. Automated reconciliation now handles 85% of line items with only exceptions requiring manual review by Layal.",
            charts: [
              {
                id: "so-residual-volume",
                title: "Daily Residual Transaction Volume ($)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Expected", data: [12400,13200,11800,14500,12900,13800,14200,12600,13400,15100,12800,14600,13900,12200,14800,13500,15200,12700,14100,13600,12900,14400] },
                    { label: "Actual Received", data: [12380,13200,11750,14500,12850,13800,14200,12550,13400,15050,12800,14540,13900,12200,14800,13500,15200,12650,14100,13600,12900,14400] }
                  ]
                }
              },
              {
                id: "so-discrepancy-trend",
                title: "Discrepancies by Acquirer (Monthly)",
                type: "stacked-bar",
                data: {
                  labels: ["Oct","Nov","Dec","Jan","Feb","Mar"],
                  datasets: [
                    { label: "Fiserv", data: [3,4,2,3,2,1] },
                    { label: "CardPoint", data: [2,1,3,2,1,2] },
                    { label: "Other", data: [5,4,3,2,2,1] }
                  ]
                }
              },
              {
                id: "so-audit-efficiency",
                title: "Audit Time vs Exceptions (Monthly)",
                type: "multi-line",
                data: {
                  labels: ["Oct","Nov","Dec","Jan","Feb","Mar"],
                  datasets: [
                    { label: "Audit Hours", data: [14,12.5,11,8.5,5.8,3.2] },
                    { label: "Exceptions Requiring Review", data: [28,24,19,14,10,7] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Acquirer","Expected ($)","Received ($)","Variance ($)","Status","Resolution"],
              rows: [
                ["Fiserv - Batch 2041","$48,200","$48,150","$50","Flagged","Under Review"],
                ["Fiserv - Batch 2040","$52,100","$52,100","$0","Matched","Auto-Reconciled"],
                ["CardPoint - Mar W4","$34,800","$34,720","$80","Flagged","Escalated"],
                ["CardPoint - Mar W3","$31,200","$31,200","$0","Matched","Auto-Reconciled"],
                ["Fiserv - Batch 2039","$44,600","$44,600","$0","Matched","Auto-Reconciled"],
                ["CardPoint - Mar W2","$28,900","$28,900","$0","Matched","Auto-Reconciled"],
                ["Fiserv - Batch 2038","$22,400","$22,350","$50","Resolved","Credit Applied"],
                ["CardPoint - Mar W1","$21,800","$21,800","$0","Matched","Auto-Reconciled"]
              ],
              badges: {
                3: {
                  "Matched": "success",
                  "Flagged": "warning",
                  "Resolved": "info",
                  "Escalated": "danger"
                }
              }
            }
          }
        }
      ],
    },

    // === SALES - WEVEND ===
    {
      name: "Sales - WeVend",
      slug: "sales-wevend",
      priorities: [
        {
          rank: 1,
          name: "AI-Powered Prospecting & Qualification Agent",
          slug: "ai-powered-prospecting-qualification-agent",
          status: "Not Started",
          who: "Anthony, Jay, Rob",
          weekly_hours: "~17.5 hrs",
          monthly_hours: "~70 hrs",
          complexity: "Medium",
          impact: "High",
          description: "AI agent that automates research and qualification of target companies, delivering pre-qualified prioritized prospect lists.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Prospects Qualified/Week", value: "142", subtitle: "Up from 28 manually" },
              { label: "Hit Rate", value: "32%", subtitle: "Up from 7-10% manual" },
              { label: "Discovery Calls/VP/Month", value: "7", subtitle: "Up from 2-4" },
              { label: "Hours Saved/Week", value: "16.5", subtitle: "Target: 15-20 hrs" }
            ],
            summary: "The AI prospecting agent has increased qualified prospects from 28 to 142 per week while improving hit rate from 7-10% to 32%. Discovery calls per VP have increased from 2-4 to 7 per month, trending toward the 10-call target. The 16.5 hours saved weekly falls within the estimated 15-20 hour range, with Anthony and Jay reclaiming most of their prospecting time.",
            charts: [
              {
                id: "sw-prospects-qualified",
                title: "Daily Prospects Qualified",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "AI Qualified", data: [18,22,20,24,19,21,26,23,28,25,22,27,24,30,26,28,32,25,29,31,27,33] },
                    { label: "Manual Research", data: [6,5,4,5,4,3,4,3,3,2,3,2,2,2,2,1,2,1,1,1,1,1] }
                  ]
                }
              },
              {
                id: "sw-hit-rate-trend",
                title: "Prospecting Hit Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Hit Rate", data: [10,12,14,15,17,18,20,21,22,24,25,26,27,28,28,29,30,30,31,31,32,32] }
                  ]
                }
              },
              {
                id: "sw-company-classification",
                title: "Company Type Classification",
                type: "doughnut",
                data: {
                  labels: ["Distributor","Manufacturer","ISV","Not Relevant"],
                  datasets: [{ data: [38,24,18,20] }]
                }
              }
            ],
            table: {
              columns: ["Company","Type","Vertical","Score","Status","Assigned To"],
              rows: [
                ["TechVend Solutions","Distributor","Vending","92","Outreach Sent","Anthony"],
                ["CleanWash Systems","Manufacturer","Car Wash","88","Discovery Call","Jay"],
                ["ParkFlow Inc","ISV","Parking","85","Outreach Sent","Anthony"],
                ["LaundroTech","Distributor","Laundromat","82","Qualified","Jay"],
                ["EV PowerGrid","Manufacturer","EV Chargers","79","Qualified","Rob"],
                ["KioskPro Global","ISV","Kiosks","76","Outreach Sent","Jay"],
                ["ArcadeConnect","Distributor","Amusement","73","Qualified","Anthony"],
                ["AutoWash Direct","Manufacturer","Car Wash","71","Research","Jay"],
                ["VendTech Plus","ISV","Vending","68","Research","Anthony"],
                ["GreenCharge Co","Distributor","EV Chargers","65","Research","Rob"]
              ],
              badges: {
                4: {
                  "Discovery Call": "success",
                  "Outreach Sent": "info",
                  "Qualified": "warning",
                  "Research": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 2,
          name: "AI Email Management & Filtering",
          slug: "ai-email-management-filtering",
          status: "Not Started",
          who: "Rob, Anthony, Jay, Oswin",
          weekly_hours: "~17.5 hrs",
          monthly_hours: "~70 hrs",
          complexity: "Medium",
          impact: "High",
          description: "AI-powered email filtering that categorizes, prioritizes, and drafts responses for routine inquiries.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Emails Auto-Categorized", value: "1,247", subtitle: "This week across team" },
              { label: "Rob's Email Time", value: "4.8 hrs/wk", subtitle: "Down from 12 hrs/wk" },
              { label: "Auto-Draft Acceptance", value: "72%", subtitle: "Drafts used as-is" },
              { label: "Support Redirected", value: "89", subtitle: "Auto-routed to CS team" }
            ],
            summary: "AI email management has categorized 1,247 emails this week with Rob's inbox management time reduced from 12 to 4.8 hours per week. The 72% auto-draft acceptance rate shows strong response quality, and 89 support inquiries were automatically redirected to the Customer Service team without rep involvement.",
            charts: [
              {
                id: "sw-email-volume",
                title: "Daily Email Volume by Category",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Action Required", data: [22,25,18,28,20,24,26,21,23,27,19,25,22,24,28,20,26,23,25,21,24,22] },
                    { label: "FYI Only", data: [45,52,40,48,44,50,42,46,38,52,44,48,42,50,44,46,40,48,42,38,44,46] },
                    { label: "Support Redirect", data: [12,15,10,14,11,13,16,12,14,18,10,14,12,13,15,11,14,12,13,10,12,14] },
                    { label: "Auto-Archived", data: [120,135,110,128,118,130,122,125,115,140,118,132,120,128,122,115,125,118,130,112,120,125] }
                  ]
                }
              },
              {
                id: "sw-email-time-saved",
                title: "Weekly Email Management Time (Hours)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Rob", data: [12,11.5,11,10.5,10,9.5,9,8.5,8,7.5,7.2,6.8,6.5,6.2,5.8,5.6,5.4,5.2,5.0,4.9,4.8,4.8] },
                    { label: "Other Reps Avg", data: [5,4.8,4.6,4.5,4.3,4.1,4.0,3.8,3.6,3.5,3.4,3.2,3.1,3.0,2.9,2.8,2.7,2.6,2.5,2.4,2.4,2.3] }
                  ]
                }
              },
              {
                id: "sw-email-categories",
                title: "Email Category Distribution",
                type: "doughnut",
                data: {
                  labels: ["Auto-Archived","FYI Only","Action Required","Support Redirect","Spam Blocked"],
                  datasets: [{ data: [52,22,14,8,4] }]
                }
              }
            ],
            table: {
              columns: ["Rep","Emails/Day","Auto-Categorized","Drafts Used","Time Saved/Week","Status"],
              rows: [
                ["Rob","198","94%","78%","7.2 hrs","Active"],
                ["Anthony","82","91%","68%","2.8 hrs","Active"],
                ["Jay","76","92%","70%","2.6 hrs","Active"],
                ["Oswin","54","89%","65%","1.8 hrs","Active"],
                ["Team Average","103","92%","72%","3.6 hrs","Active"]
              ],
              badges: {
                5: {
                  "Active": "success",
                  "Pilot": "info",
                  "Pending": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 3,
          name: "CRM Overhaul — Pipeline, Dashboards, Forecasting",
          slug: "crm-overhaul-pipeline-dashboards-forecasting",
          status: "Not Started",
          who: "Oswin, all reps",
          weekly_hours: "N/A",
          monthly_hours: "N/A",
          complexity: "High",
          impact: "High",
          description: "Transform WeSell CRM into a full sales operating system with pipeline management, forecasting, and automation.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Pipeline Visibility", value: "Phase 1", subtitle: "Basic pipeline view live" },
              { label: "Active Deals Tracked", value: "34", subtitle: "Previously invisible" },
              { label: "Forecast Accuracy", value: "68%", subtitle: "Target: 85%" },
              { label: "Rep Adoption Rate", value: "58%", subtitle: "Target: 90%" }
            ],
            summary: "CRM overhaul Phase 1 has delivered a basic pipeline view now tracking 34 active deals that were previously invisible to management. Forecast accuracy stands at 68%, still short of the 85% target. Rep adoption at 58% remains the key challenge, with Rob's data migration from personal files being the primary blocker to full team buy-in.",
            charts: [
              {
                id: "sw-pipeline-value",
                title: "Pipeline Value by Stage ($K)",
                type: "horizontal-bar",
                data: {
                  labels: ["Prospecting","Discovery","Proposal","Negotiation","Closed Won","Closed Lost"],
                  datasets: [
                    { label: "Pipeline Value", data: [320,245,180,125,420,85] }
                  ]
                }
              },
              {
                id: "sw-deal-movement",
                title: "Daily Deal Stage Changes",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Deals Advanced", data: [2,3,1,4,2,3,5,2,4,3,2,4,3,5,2,4,3,2,5,3,4,3] },
                    { label: "Deals Stalled", data: [1,0,2,1,0,1,0,2,1,0,1,0,1,0,2,1,0,1,0,1,0,1] }
                  ]
                }
              },
              {
                id: "sw-crm-adoption",
                title: "CRM Feature Adoption (%)",
                type: "bar",
                data: {
                  labels: ["Pipeline View","Deal Entry","Activity Log","Forecast","Contact Mgmt","Reports"],
                  datasets: [
                    { label: "Adoption Rate", data: [72,58,42,35,65,28] }
                  ]
                }
              }
            ],
            table: {
              columns: ["CRM Feature","Phase","Status","Completion","Blocker"],
              rows: [
                ["Pipeline Stages","Phase 1","Live","100%","None"],
                ["Basic Pipeline View","Phase 1","Live","100%","None"],
                ["Deal Visibility","Phase 1","Live","90%","Data migration"],
                ["Rep Dashboard","Phase 2","In Progress","45%","Dev capacity"],
                ["Pipeline Forecasting","Phase 3","Planned","10%","Phase 2 dependency"],
                ["Lead Scoring","Phase 3","Planned","0%","Phase 2 dependency"],
                ["Auto-Assignment","Phase 3","Planned","0%","Scoring logic needed"],
                ["Activity Tracking","Phase 4","Not Started","0%","Email integration"],
                ["Deal Stage Automation","Phase 5","Not Started","0%","Phase 4 dependency"],
                ["Executive Dashboard","Phase 2","In Progress","35%","Data completeness"]
              ],
              badges: {
                2: {
                  "Live": "success",
                  "In Progress": "warning",
                  "Planned": "info",
                  "Not Started": "danger"
                }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Standardized Proposal & Pricing Automation",
          slug: "standardized-proposal-pricing-automation",
          status: "Not Started",
          who: "Oswin, VPs",
          weekly_hours: "~6.5 hrs",
          monthly_hours: "~26 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Create standardized proposal templates with automated pricing insertion and consistent formatting.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Templates in Use", value: "3", subtitle: "Covering 85% of deals" },
              { label: "From-Scratch Proposals", value: "12%", subtitle: "Down from 50%" },
              { label: "Revision Rounds Avg", value: "2.4", subtitle: "Down from 4-5 rounds" },
              { label: "Hours Saved/Week", value: "6.2", subtitle: "Target: 5-8 hrs" }
            ],
            summary: "Standardized proposal automation has reduced from-scratch proposals from 50% to 12% with 3 templates now covering 85% of deals. Revision rounds have dropped from 4-5 to an average of 2.4, saving 6.2 hours per week. Oswin still reviews non-standard pricing but VPs now generate standard-priced proposals independently.",
            charts: [
              {
                id: "sw-proposal-method",
                title: "Proposal Creation Method Over Time",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Template-Based", data: [1,2,1,2,3,2,3,2,3,2,3,2,3,3,2,3,2,3,3,2,3,3] },
                    { label: "From Scratch", data: [1,1,1,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,0,0] }
                  ]
                }
              },
              {
                id: "sw-revision-rounds",
                title: "Average Revision Rounds per Proposal",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Revision Rounds", data: [4.5,4.2,4.0,3.8,3.6,3.4,3.2,3.1,3.0,2.9,2.8,2.8,2.7,2.6,2.6,2.5,2.5,2.5,2.4,2.4,2.4,2.4] }
                  ]
                }
              },
              {
                id: "sw-proposal-turnaround",
                title: "Proposal Turnaround Time (Days)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Turnaround Days", data: [5.2,4.8,4.5,4.2,4.0,3.8,3.5,3.3,3.2,3.0,2.9,2.8,2.7,2.6,2.5,2.4,2.3,2.2,2.2,2.1,2.1,2.0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Template","Type","Usage Count","Avg Revisions","Avg Turnaround","VP Self-Serve"],
              rows: [
                ["Standard Vending","Small Deal","18","2.1","1.8 days","Yes"],
                ["Enterprise Kiosk","Large Deal","8","3.2","3.4 days","No"],
                ["Multi-Location","Bundle Deal","6","2.8","2.6 days","Yes"],
                ["Custom (No Template)","Special","4","4.2","4.8 days","No"],
                ["EV Charging","New Vertical","3","2.5","2.2 days","Yes"],
                ["Amusement Package","Specialty","2","2.9","2.8 days","No"]
              ],
              badges: {
                5: {
                  "Yes": "success",
                  "No": "danger"
                }
              }
            }
          }
        },
        {
          rank: 5,
          name: "Merchant FAQ / Self-Service Portal",
          slug: "merchant-faq-self-service-portal",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~12.5 hrs",
          monthly_hours: "~50 hrs",
          complexity: "Low",
          impact: "High",
          description: "Build a merchant-facing FAQ or self-service knowledge base answering the most common merchant questions.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "FAQ Articles Live", value: "24", subtitle: "Covering top questions" },
              { label: "Support Calls Deflected", value: "68%", subtitle: "Target: 80%" },
              { label: "Self-Service Visits/Week", value: "312", subtitle: "Growing steadily" },
              { label: "Rep Hours Reclaimed", value: "10.8", subtitle: "Target: 10-15 hrs/wk" }
            ],
            summary: "The merchant FAQ portal now has 24 live articles covering the top questions about rates, fees, Fiserv, CardPoint, and PCI compliance. Support call deflection has reached 68% with 312 weekly self-service visits. Reps have reclaimed 10.8 hours per week, falling within the 10-15 hour target range and allowing significantly more selling time.",
            charts: [
              {
                id: "sw-faq-visits",
                title: "Daily Self-Service Portal Visits",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Portal Visits", data: [22,28,32,35,38,40,42,44,46,48,44,50,48,52,50,54,52,56,54,58,56,60] }
                  ]
                }
              },
              {
                id: "sw-support-deflection",
                title: "Support Call Volume: Before vs After FAQ",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Calls to Reps", data: [18,16,15,14,14,13,12,12,11,11,10,10,9,9,8,8,8,7,7,7,6,6] },
                    { label: "Self-Served via FAQ", data: [4,6,8,10,12,14,16,18,18,20,20,22,22,24,24,26,26,28,28,30,30,32] }
                  ]
                }
              },
              {
                id: "sw-top-faq-topics",
                title: "Top FAQ Topic Categories",
                type: "doughnut",
                data: {
                  labels: ["Rates and Fees","PCI Compliance","Fiserv/CardPoint Info","Application Status","Terminal Setup"],
                  datasets: [{ data: [35,22,18,15,10] }]
                }
              }
            ],
            table: {
              columns: ["FAQ Article","Category","Views/Week","Helpful Rating","Last Updated"],
              rows: [
                ["What is the $20/month minimum processing fee?","Rates","48","92%","Apr 5"],
                ["How to complete your PCI Survey","PCI","42","88%","Apr 3"],
                ["What is a DDA Reject fee ($25)?","Rates","38","90%","Apr 2"],
                ["Who is Fiserv and what do they do?","Processor Info","35","85%","Mar 28"],
                ["What is the Chargeback fee ($25)?","Rates","32","91%","Apr 1"],
                ["What is a Retrieval fee ($15)?","Rates","28","89%","Mar 30"],
                ["What is the PCI Non-Compliance fee ($19.95)?","PCI","25","87%","Apr 4"],
                ["Who is CardPoint?","Processor Info","22","84%","Mar 27"],
                ["How to check my application status","Status","20","78%","Apr 6"],
                ["Terminal setup and activation guide","Setup","18","82%","Apr 5"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 6,
          name: "Automated Onboarding + Doc Collection",
          slug: "automated-onboarding-doc-collection",
          status: "Not Started",
          who: "Onboarding specialist",
          weekly_hours: "~7.5 hrs",
          monthly_hours: "~30 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automate merchant document collection, status tracking, automated reminders, and handoff to Operations.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Applications in Pipeline", value: "42", subtitle: "18 complete, 24 pending docs" },
              { label: "SLA Compliance", value: "91%", subtitle: "3-day SLA target" },
              { label: "Manual Follow-Ups Saved", value: "78%", subtitle: "Auto-reminders working" },
              { label: "Specialist Capacity", value: "3.2x", subtitle: "vs 1x before automation" }
            ],
            summary: "Document collection automation is handling 42 applications in pipeline with 91% SLA compliance, up from 72% before automation. Automated reminders have eliminated 78% of manual follow-up emails for missing documents. The onboarding specialist can now handle 3.2x the previous volume, preparing the team for scale to 10,000 terminals.",
            charts: [
              {
                id: "sw-doc-collection-status",
                title: "Daily Application Status",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Docs Complete", data: [8,10,9,12,11,14,13,15,14,16,15,17,16,18,17,19,18,20,19,21,20,22] },
                    { label: "Awaiting Docs", data: [15,14,16,13,14,12,13,11,12,10,11,10,11,9,10,8,9,8,9,7,8,7] },
                    { label: "Reminder Sent", data: [6,5,7,5,6,4,5,4,5,3,4,3,4,3,3,2,3,2,3,2,2,2] }
                  ]
                }
              },
              {
                id: "sw-sla-trend",
                title: "3-Day SLA Compliance Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "SLA Met", data: [72,74,75,76,78,80,81,82,84,85,86,87,88,88,89,89,90,90,90,91,91,91] }
                  ]
                }
              },
              {
                id: "sw-missing-doc-types",
                title: "Most Common Missing Documents",
                type: "horizontal-bar",
                data: {
                  labels: ["Banking Info","Valid License","Proof of Existence","Machine Photo","Lease Agreement","Tax ID Doc"],
                  datasets: [
                    { label: "Missing Count", data: [18,14,12,10,8,5] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Merchant","Application Date","Docs Status","Missing Items","Reminders Sent","SLA Status"],
              rows: [
                ["Fresh Bites Vending","Apr 5","Complete","None","0","On Track"],
                ["QuickSnack Corp","Apr 4","Complete","None","1","On Track"],
                ["Metro Car Wash","Apr 3","Partial","Banking Info","2","On Track"],
                ["ParkEasy Systems","Apr 2","Partial","License, Photo","1","At Risk"],
                ["LaundroMax Inc","Apr 1","Partial","Banking Info","3","Overdue"],
                ["EV Charge Now","Mar 31","Complete","None","0","On Track"],
                ["VendRight LLC","Mar 30","Complete","None","1","On Track"],
                ["CleanWash Pro","Mar 28","Partial","Lease Agreement","2","At Risk"],
                ["ArcadeWorld","Mar 27","Complete","None","0","On Track"],
                ["SnackTime Ops","Mar 26","Complete","None","1","On Track"]
              ],
              badges: {
                5: {
                  "On Track": "success",
                  "At Risk": "warning",
                  "Overdue": "danger"
                }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Automated Payment-to-Deployment Handoff",
          slug: "automated-payment-to-deployment-handoff",
          status: "Not Started",
          who: "Sales team",
          weekly_hours: "~2.5 hrs",
          monthly_hours: "~10 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Automate the relay from Accounting payment confirmation to Operations terminal deployment.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Handoffs Automated", value: "38", subtitle: "This month" },
              { label: "Avg Relay Time", value: "12 min", subtitle: "Down from 4+ hours" },
              { label: "Zero-Touch Rate", value: "84%", subtitle: "No sales involvement" },
              { label: "Hours Saved/Week", value: "2.4", subtitle: "Target: 2-3 hrs" }
            ],
            summary: "Payment-to-deployment automation has processed 38 handoffs this month with average relay time dropping from 4+ hours to just 12 minutes. The 84% zero-touch rate means Sales is no longer acting as middleman for the vast majority of deployments. The 2.4 hours saved weekly is within the 2-3 hour target range.",
            charts: [
              {
                id: "sw-handoff-time",
                title: "Payment-to-Deployment Relay Time (Hours)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Relay Time", data: [4.2,3.8,3.5,3.0,2.5,2.2,1.8,1.5,1.2,1.0,0.8,0.6,0.5,0.4,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2] }
                  ]
                }
              },
              {
                id: "sw-deployment-volume",
                title: "Daily Deployment Handoffs",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Automated", data: [1,2,1,2,1,2,2,1,2,2,1,2,2,2,1,2,2,2,2,1,2,2] },
                    { label: "Manual", data: [1,0,1,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,0,0] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Order ID","Customer","Payment Date","Notification Sent","Deployment Started","Relay Time"],
              rows: [
                ["ORD-1082","Fresh Bites Vending","Apr 7","Apr 7 9:04am","Apr 7 9:18am","14 min"],
                ["ORD-1081","Metro Car Wash","Apr 6","Apr 6 2:15pm","Apr 6 2:28pm","13 min"],
                ["ORD-1080","ParkEasy Systems","Apr 4","Apr 4 11:30am","Apr 4 11:42am","12 min"],
                ["ORD-1079","VendRight LLC","Apr 3","Apr 3 3:45pm","Apr 3 3:56pm","11 min"],
                ["ORD-1078","CleanWash Pro","Apr 2","Apr 2 10:20am","Apr 2 10:35am","15 min"],
                ["ORD-1077","SnackTime Ops","Apr 1","Apr 1 1:10pm","Apr 1 1:20pm","10 min"],
                ["ORD-1076","ArcadeWorld","Mar 31","Mar 31 4:00pm","Manual next day","18 hrs"],
                ["ORD-1075","LaundroMax Inc","Mar 30","Mar 30 9:45am","Mar 30 9:55am","10 min"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 8,
          name: "CRM Auto-Population from Emails/Calls",
          slug: "crm-auto-population-from-emails-calls",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~10.5 hrs",
          monthly_hours: "~42 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Automatically capture and log sales activities in the CRM without manual data entry.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Activities Auto-Logged/Day", value: "84", subtitle: "Across all reps" },
              { label: "CRM Data Completeness", value: "76%", subtitle: "Up from 32%" },
              { label: "Rep Admin Time Saved", value: "8.4 hrs/wk", subtitle: "Target: 9-12 hrs" },
              { label: "Email-to-CRM Accuracy", value: "89%", subtitle: "AI extraction rate" }
            ],
            summary: "CRM auto-population is logging 84 activities daily with data completeness jumping from 32% to 76%. The 8.4 hours saved per week across the team is approaching the 9-12 hour target. AI extraction accuracy at 89% means most email data is correctly captured, with Rob showing the biggest improvement since he previously entered minimal data manually.",
            charts: [
              {
                id: "sw-auto-log-volume",
                title: "Daily Auto-Logged Activities",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Emails Logged", data: [28,32,30,35,33,38,36,40,38,42,40,44,42,46,44,48,45,50,48,52,50,54] },
                    { label: "Calls Logged", data: [8,10,9,12,10,14,12,15,14,16,14,18,16,18,16,20,18,20,18,22,20,22] },
                    { label: "Meetings Logged", data: [2,3,2,4,3,4,3,5,4,5,4,6,5,6,5,6,5,7,6,7,6,8] }
                  ]
                }
              },
              {
                id: "sw-crm-completeness",
                title: "CRM Data Completeness by Rep (%)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Rob", data: [15,18,22,25,28,32,35,38,42,45,48,52,55,58,60,63,65,68,70,72,74,76] },
                    { label: "Anthony", data: [42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,79,80,82] },
                    { label: "Jay", data: [38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,75,76,78] }
                  ]
                }
              },
              {
                id: "sw-extraction-accuracy",
                title: "AI Data Extraction Accuracy (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Accuracy", data: [72,74,75,76,78,79,80,81,82,83,84,84,85,86,86,87,87,88,88,89,89,89] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Emails/Day","Auto-Logged","Manual Entry","Completeness","Time Saved/Week"],
              rows: [
                ["Rob","198","92%","8%","76%","3.8 hrs"],
                ["Anthony","82","88%","12%","82%","2.4 hrs"],
                ["Jay","76","86%","14%","78%","2.2 hrs"],
                ["Team Total","356","89%","11%","79%","8.4 hrs"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 9,
          name: "Follow-Up Tracking & Automation",
          slug: "follow-up-tracking-automation",
          status: "Not Started",
          who: "All reps, Oswin",
          weekly_hours: "~4 hrs",
          monthly_hours: "~16 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Shared follow-up tracking system with automated reminders replacing personal notes and memory.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Active Follow-Ups Tracked", value: "128", subtitle: "Across all reps" },
              { label: "Compliance Rate", value: "93%", subtitle: "Target: 95%" },
              { label: "Dropped Prospects", value: "2", subtitle: "Down from 12 last month" },
              { label: "Hours Saved/Week", value: "3.8", subtitle: "Target: 3-5 hrs" }
            ],
            summary: "Follow-up tracking now covers 128 active prospects with a 93% compliance rate, approaching the 95% target. Dropped prospects have fallen from 12 per month to just 2, meaning virtually no qualified leads fall through the cracks. The shared visibility means Oswin can see all rep pipelines in real-time without manual status pulls during weekly calls.",
            charts: [
              {
                id: "sw-followup-compliance",
                title: "Daily Follow-Up Compliance Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Compliance Rate", data: [72,74,76,78,80,82,83,84,86,87,88,89,89,90,91,91,92,92,92,93,93,93] }
                  ]
                }
              },
              {
                id: "sw-followup-status",
                title: "Follow-Up Status Distribution",
                type: "doughnut",
                data: {
                  labels: ["On Schedule","Due Today","Overdue (1 day)","Overdue (2+ days)"],
                  datasets: [{ data: [82,24,16,6] }]
                }
              },
              {
                id: "sw-dropped-prospects",
                title: "Monthly Dropped Prospects",
                type: "bar",
                data: {
                  labels: ["Oct","Nov","Dec","Jan","Feb","Mar","Apr (proj)"],
                  datasets: [
                    { label: "Dropped Prospects", data: [18,15,14,12,8,4,2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Active Leads","On Schedule","Overdue","Compliance","Next Follow-Up"],
              rows: [
                ["Anthony","38","34","4","89%","Today 2pm"],
                ["Jay","42","40","2","95%","Today 3pm"],
                ["Rob","48","46","2","96%","Tomorrow 9am"],
                ["Team Total","128","120","8","93%","N/A"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 10,
          name: "Automated Post-Trade-Show Nurture Sequences",
          slug: "automated-post-trade-show-nurture-sequences",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~3 hrs",
          monthly_hours: "~12 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Automated nurture email sequences to keep non-converting trade show leads warm.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Leads in Nurture", value: "64", subtitle: "From 4 trade shows" },
              { label: "Engagement Rate", value: "34%", subtitle: "Opens + clicks" },
              { label: "Conversions from Nurture", value: "8", subtitle: "Became discovery calls" },
              { label: "Rep Time Saved/Week", value: "3.2", subtitle: "Target: 2-4 hrs" }
            ],
            summary: "Automated nurture sequences are managing 64 leads from 4 trade shows with a 34% engagement rate. Eight leads have converted to discovery calls through automated sequences alone, pushing trade show conversion from 25% toward the 35% target. The 3.2 hours saved weekly eliminates manual follow-up on non-converting leads during trade show season.",
            charts: [
              {
                id: "sw-nurture-funnel",
                title: "Nurture Sequence Funnel",
                type: "horizontal-bar",
                data: {
                  labels: ["Entered Sequence","Opened Email","Clicked Link","Replied","Booked Discovery"],
                  datasets: [
                    { label: "Leads", data: [64,42,22,14,8] }
                  ]
                }
              },
              {
                id: "sw-nurture-engagement",
                title: "Weekly Nurture Email Engagement",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Open Rate %", data: [28,30,32,31,33,34,35,34,36,35,37,36,38,37,39,38,40,39,41,40,42,41] },
                    { label: "Click Rate %", data: [8,9,10,10,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20] }
                  ]
                }
              },
              {
                id: "sw-tradeshow-conversion",
                title: "Trade Show Lead Conversion Rate (%)",
                type: "bar",
                data: {
                  labels: ["NAMA Show","Kiosk Expo","EV Summit","Car Wash Con"],
                  datasets: [
                    { label: "Immediate Convert", data: [25,28,22,30] },
                    { label: "Nurture Convert", data: [8,12,6,10] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Trade Show","Date","Leads Captured","In Nurture","Converted","Engagement Rate"],
              rows: [
                ["NAMA Show 2026","Mar 12-14","22","14","4","36%"],
                ["Kiosk Innovation Expo","Feb 26-28","18","12","3","32%"],
                ["EV Charging Summit","Feb 10-12","14","10","1","28%"],
                ["Car Wash Convention","Jan 22-24","20","16","4","38%"],
                ["Amusement Trade Fair","Dec 8-10","12","8","2","30%"],
                ["Vending World Expo","Nov 18-20","16","4","3","42%"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 11,
          name: "Rob's Customer Knowledge Documentation",
          slug: "robs-customer-knowledge-documentation",
          status: "Not Started",
          who: "Rob",
          weekly_hours: "N/A",
          monthly_hours: "N/A",
          complexity: "Medium",
          impact: "Critical",
          description: "Systematically extract and document Rob's customer knowledge into a shared system for business continuity.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Accounts Documented", value: "12 of 28", subtitle: "43% complete" },
              { label: "Knowledge Sessions Done", value: "8", subtitle: "1-2 hrs each" },
              { label: "Critical Risk Level", value: "Medium", subtitle: "Was Critical" },
              { label: "Account Manager Ready", value: "65%", subtitle: "Onboarding coverage" }
            ],
            summary: "Knowledge extraction has documented 12 of 28 active customer accounts through 8 structured sessions with Rob. Critical risk level has been downgraded from Critical to Medium as the Account Manager now has sufficient documentation to manage 65% of accounts independently. Remaining sessions are prioritized by account revenue and relationship complexity.",
            charts: [
              {
                id: "sw-knowledge-progress",
                title: "Account Documentation Progress",
                type: "doughnut",
                data: {
                  labels: ["Fully Documented","Partially Documented","Not Started"],
                  datasets: [{ data: [12,8,8] }]
                }
              },
              {
                id: "sw-knowledge-sessions",
                title: "Knowledge Extraction Sessions Completed",
                type: "bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"],
                  datasets: [
                    { label: "Sessions", data: [1,1,2,1,2,1] },
                    { label: "Accounts Covered", data: [1,2,3,2,3,1] }
                  ]
                }
              },
              {
                id: "sw-risk-reduction",
                title: "Business Continuity Risk Score Over Time",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Risk Score (10=Critical)", data: [9.5,9.2,9.0,8.8,8.5,8.2,8.0,7.8,7.5,7.2,7.0,6.8,6.5,6.2,6.0,5.8,5.5,5.3,5.0,4.8,4.5,4.2] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Account","Revenue Tier","Documentation Status","Session Date","Key Contacts","Handoff Ready"],
              rows: [
                ["National Vending Corp","Tier 1","Complete","Mar 10","4 documented","Yes"],
                ["Metro Retail Group","Tier 1","Complete","Mar 12","3 documented","Yes"],
                ["Pacific Coast Kiosks","Tier 1","Complete","Mar 17","5 documented","Yes"],
                ["AutoWash Enterprises","Tier 1","Complete","Mar 19","3 documented","Yes"],
                ["LaundroKing Chain","Tier 2","Complete","Mar 24","2 documented","Yes"],
                ["QuickCharge EV","Tier 2","Complete","Mar 26","4 documented","Yes"],
                ["SnackMaster Inc","Tier 2","Partial","Mar 31","2 of 4 done","Partial"],
                ["ParkSmart Systems","Tier 2","Partial","Apr 2","1 of 3 done","Partial"],
                ["FunZone Amusements","Tier 2","Partial","Scheduled","Not started","No"],
                ["GreenVend Co","Tier 3","Not Started","TBD","Unknown","No"],
                ["Coastal Car Wash","Tier 3","Not Started","TBD","Unknown","No"],
                ["MiniMart Vending","Tier 3","Not Started","TBD","Unknown","No"]
              ],
              badges: {
                5: {
                  "Yes": "success",
                  "Partial": "warning",
                  "No": "danger"
                }
              }
            }
          }
        },
        {
          rank: 12,
          name: "Weekly Sales Meeting Automation",
          slug: "weekly-sales-meeting-automation",
          status: "Not Started",
          who: "Oswin",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Low",
          impact: "Low",
          description: "Automate meeting prep, note-taking, and action item tracking for weekly sales meetings.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Meetings Automated", value: "6", subtitle: "Weekly cadence" },
              { label: "Action Items Tracked", value: "34", subtitle: "Active this week" },
              { label: "Completion Rate", value: "82%", subtitle: "Up from ~50% estimated" },
              { label: "Prep Time Saved", value: "1.4 hrs/wk", subtitle: "Target: 1-2 hrs" }
            ],
            summary: "Weekly sales meeting automation has processed 6 meetings with 34 active action items tracked at 82% completion rate, up from an estimated 50% when items were tracked informally. Auto-generated agendas from CRM pipeline data save 1.4 hours per week in prep time. Action item reminders between meetings have significantly reduced the number of slipped commitments.",
            charts: [
              {
                id: "sw-action-items",
                title: "Action Items: Created vs Completed",
                type: "bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"],
                  datasets: [
                    { label: "Created", data: [8,12,10,14,11,13] },
                    { label: "Completed", data: [5,8,8,12,9,11] }
                  ]
                }
              },
              {
                id: "sw-meeting-efficiency",
                title: "Meeting Duration and Prep Time (Minutes)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Meeting Duration", data: [62,60,58,55,54,52,50,48,48,46,45,44,44,42,42,40,40,38,38,36,36,35] },
                    { label: "Prep Time", data: [35,32,30,28,25,22,20,18,16,15,14,12,12,10,10,8,8,8,6,6,6,5] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Action Item","Assigned To","Due Date","Status","Meeting Source"],
              rows: [
                ["Update pipeline forecast Q2","Oswin","Apr 8","Complete","Apr 7 Meeting"],
                ["Follow up with National Vending renewal","Rob","Apr 9","In Progress","Apr 7 Meeting"],
                ["Send revised proposal to Metro Retail","Anthony","Apr 8","Complete","Apr 7 Meeting"],
                ["Schedule discovery call with ParkFlow","Jay","Apr 10","Pending","Apr 7 Meeting"],
                ["Compile Q1 win/loss analysis","Oswin","Apr 11","In Progress","Mar 31 Meeting"],
                ["Demo prep for Kiosk Innovation lead","Jay","Apr 9","Complete","Mar 31 Meeting"],
                ["Submit add-on request for AutoWash","Rob","Apr 7","Complete","Mar 31 Meeting"],
                ["Review pricing for EV vertical template","Oswin","Apr 10","Pending","Mar 31 Meeting"]
              ],
              badges: {
                3: {
                  "Complete": "success",
                  "In Progress": "warning",
                  "Pending": "neutral",
                  "Overdue": "danger"
                }
              }
            }
          }
        }
      ],
    },

    // === SALES - MONEX ===
    {
      name: "Sales - Monex",
      slug: "sales-monex",
      priorities: [
        {
          rank: 1,
          name: "Automated Lead Assignment (Teleleads)",
          slug: "automated-lead-assignment-teleleads",
          status: "Not Started",
          who: "John, Henry, Brendan",
          weekly_hours: "~0.8 hrs",
          monthly_hours: "~3.3 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Rule-based auto-assignment of new leads to the correct rep based on vertical, geography, and round-robin logic.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Leads Auto-Assigned/Week", value: "24", subtitle: "Of 28 total leads" },
              { label: "Avg Assignment Time", value: "< 1 min", subtitle: "Was 2+ min manual" },
              { label: "Off-Hours Coverage", value: "100%", subtitle: "No overnight gaps" },
              { label: "Weekly Time Saved", value: "48 min", subtitle: "Target: 45-55 min" }
            ],
            summary: "Lead auto-assignment now handles 24 of 28 weekly leads with sub-minute routing. Off-hours coverage has eliminated overnight lead gaps that previously risked losing hot prospects. The 48 minutes saved weekly falls within the 45-55 minute target, and John is no longer a single point of failure for lead distribution.",
            charts: [
              {
                id: "sm-lead-assignment-volume",
                title: "Daily Lead Assignments",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Auto-Assigned", data: [4,5,3,6,4,5,4,6,3,5,4,6,5,4,6,5,4,5,6,3,5,4] },
                    { label: "Manual Override", data: [1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1] }
                  ]
                }
              },
              {
                id: "sm-lead-routing",
                title: "Lead Distribution by Vertical",
                type: "doughnut",
                data: {
                  labels: ["Car Wash","Vending","Attended (Canada)","Parking","Other"],
                  datasets: [{ data: [35,28,18,12,7] }]
                }
              },
              {
                id: "sm-response-time",
                title: "Lead Response Time (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "First Contact Time", data: [125,110,95,85,72,65,58,52,48,44,40,38,35,32,30,28,26,25,24,22,20,18] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Vertical","Leads Assigned","Response Time","Conversion Rate","Status"],
              rows: [
                ["Brady","Vending","8","14 min","22%","Active"],
                ["Nancy","Car Wash","7","18 min","19%","Active"],
                ["Karina","Car Wash","6","22 min","17%","Active"],
                ["Quentin","Car Wash","5","20 min","18%","Active"],
                ["Manny","Vending/Car Wash","6","16 min","21%","Active"],
                ["Henry","Attended (Canada)","4","25 min","24%","Active"],
                ["Brendan","Attended (Canada)","3","28 min","20%","Active"],
                ["Unassigned (US Attended)","US Attended","2","N/A","N/A","Flagged"]
              ],
              badges: {
                5: {
                  "Active": "success",
                  "Flagged": "warning"
                }
              }
            }
          }
        },
        {
          rank: 2,
          name: "Application Automation (Questionnaire to DocuSign)",
          slug: "application-automation-questionnaire-to-docusign",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~1.75 hrs",
          monthly_hours: "~7 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Automate the flow from customer questionnaire to fully populated DocuSign application.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Applications Automated", value: "18", subtitle: "This month" },
              { label: "Time per Application", value: "12 min", subtitle: "Down from 60 min" },
              { label: "Error Rate", value: "4%", subtitle: "Down from 15%" },
              { label: "Weekly Hours Saved", value: "1.8", subtitle: "Target: 1.5-2 hrs" }
            ],
            summary: "Application automation has processed 18 applications this month with per-application time reduced from 60 to 12 minutes. The error rate dropped from 15% to 4% by eliminating manual data entry, with inline questionnaire guidance addressing the most common failures around legal business names and banking mismatches. Weekly savings of 1.8 hours track within the 1.5-2 hour target.",
            charts: [
              {
                id: "sm-app-volume",
                title: "Weekly Application Volume",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Automated", data: [0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1] },
                    { label: "Manual", data: [1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0] }
                  ]
                }
              },
              {
                id: "sm-app-processing-time",
                title: "Application Processing Time (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Processing Time", data: [58,52,48,44,40,36,32,28,26,24,22,20,18,18,16,16,14,14,13,12,12,12] }
                  ]
                }
              },
              {
                id: "sm-app-error-types",
                title: "Application Error Types",
                type: "doughnut",
                data: {
                  labels: ["Legal Name Mismatch","Banking Mismatch","Missing Fields","Format Error","Other"],
                  datasets: [{ data: [32,28,20,12,8] }]
                }
              }
            ],
            table: {
              columns: ["Application ID","Customer","Vertical","Method","Processing Time","Errors","Status"],
              rows: [
                ["APP-2041","NorthStar Vending","Vending","Automated","10 min","0","Sent to DocuSign"],
                ["APP-2040","CleanRite Car Wash","Car Wash","Automated","12 min","0","Signed"],
                ["APP-2039","ParkValet Systems","Parking","Automated","14 min","1","Review Needed"],
                ["APP-2038","SnackHaven Inc","Vending","Automated","11 min","0","Signed"],
                ["APP-2037","WashWorld Canada","Car Wash","Manual","48 min","2","Corrected"],
                ["APP-2036","CoinOp Laundry","Laundromat","Automated","13 min","0","Signed"],
                ["APP-2035","EV Grid Solutions","EV Chargers","Automated","15 min","1","Review Needed"],
                ["APP-2034","QuickVend Co","Vending","Automated","10 min","0","Signed"]
              ],
              badges: {
                6: {
                  "Signed": "success",
                  "Sent to DocuSign": "info",
                  "Review Needed": "warning",
                  "Corrected": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 3,
          name: "Lead Follow-Up Monitoring & Alerts",
          slug: "lead-follow-up-monitoring-alerts",
          status: "Not Started",
          who: "All reps, John",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Low",
          impact: "Critical",
          description: "Automated monitoring that flags leads not contacted within 48 hours and alerts the rep and/or John.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Leads Monitored", value: "386", subtitle: "Active across team" },
              { label: "Alerts Fired/Week", value: "12", subtitle: "Down from 28 initially" },
              { label: "48-Hr Contact Rate", value: "94%", subtitle: "Up from ~70%" },
              { label: "Deals Recovered", value: "6", subtitle: "From cold lead alerts" }
            ],
            summary: "Lead follow-up monitoring covers 386 active leads with a 94% 48-hour contact rate, up from roughly 70% before automation. Weekly alerts have dropped from 28 to 12 as reps have adapted their behavior. Six deals have been recovered this month from leads that would have gone cold, validating the 3x close rate improvement for leads contacted within 30 minutes.",
            charts: [
              {
                id: "sm-contact-rate",
                title: "48-Hour Contact Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Contact Rate", data: [70,72,74,76,78,80,82,83,84,86,87,88,89,90,90,91,92,92,93,93,94,94] }
                  ]
                }
              },
              {
                id: "sm-alert-volume",
                title: "Daily Overdue Lead Alerts",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Alerts", data: [6,5,5,4,5,4,3,4,3,3,2,3,2,2,2,2,1,2,1,2,1,1] }
                  ]
                }
              },
              {
                id: "sm-lead-aging",
                title: "Lead Age Distribution at First Contact",
                type: "doughnut",
                data: {
                  labels: ["Under 30 min","30 min - 4 hrs","4-24 hrs","24-48 hrs","Over 48 hrs"],
                  datasets: [{ data: [28,34,22,10,6] }]
                }
              },
              {
                id: "sm-recovery-impact",
                title: "Recovered Deal Value ($K)",
                type: "bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5"],
                  datasets: [
                    { label: "Recovered Value", data: [12,8,18,22,15] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Lead","Rep","Age at Contact","Alert Sent","Result","Deal Value"],
              rows: [
                ["CarWash Express","Nancy","18 min","No","Discovery Booked","$14K"],
                ["ParkIt Solutions","Quentin","2.5 hrs","No","Proposal Sent","$22K"],
                ["VendMax Corp","Brady","6 hrs","Yes","Qualified","$8K"],
                ["CleanCoat Auto","Karina","1.2 hrs","No","Discovery Booked","$18K"],
                ["EasyPark Canada","Henry","35 min","No","Proposal Sent","$12K"],
                ["SnackZone Inc","Manny","4.5 hrs","Yes","Follow-Up Set","$6K"],
                ["WashPro Systems","Nancy","28 hrs","Yes","Re-engaged","$15K"],
                ["CoinVend Ltd","Brady","12 min","No","Won","$10K"]
              ],
              badges: {
                4: {
                  "Discovery Booked": "success",
                  "Proposal Sent": "success",
                  "Qualified": "info",
                  "Follow-Up Set": "warning",
                  "Re-engaged": "info",
                  "Won": "success"
                }
              }
            }
          }
        },
        {
          rank: 4,
          name: "Automated Payment Confirmation Notifications",
          slug: "automated-payment-confirmation-notifications",
          status: "Not Started",
          who: "All reps, Finance",
          weekly_hours: "~0.75 hrs",
          monthly_hours: "~3 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Auto-notify reps when Finance marks an invoice as paid.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Notifications Sent", value: "42", subtitle: "This month" },
              { label: "Avg Notification Delay", value: "3 min", subtitle: "Was hours of chasing" },
              { label: "Finance Interruptions", value: "0", subtitle: "Down from 8-10/week" },
              { label: "Time Saved/Week", value: "52 min", subtitle: "Target: 30-60 min" }
            ],
            summary: "Automated payment notifications have sent 42 alerts this month with an average 3-minute delay from Finance marking invoices paid. Finance interruptions from reps checking payment status have dropped to zero from 8-10 per week. The 52 minutes saved weekly, split between reps and Finance staff, falls within the 30-60 minute target.",
            charts: [
              {
                id: "sm-payment-notifications",
                title: "Daily Payment Notifications Sent",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Notifications", data: [2,1,3,2,1,2,3,1,2,2,3,1,2,2,3,2,1,3,2,2,1,3] }
                  ]
                }
              },
              {
                id: "sm-payment-delay",
                title: "Time from Payment to Rep Notification (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Notification Delay", data: [180,150,120,90,60,45,30,20,15,10,8,6,5,4,4,3,3,3,3,3,3,3] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Invoice","Customer","Amount","Payment Date","Notification Sent","Rep Notified"],
              rows: [
                ["INV-4082","NorthStar Vending","$4,200","Apr 7","Apr 7 9:03am","Brady"],
                ["INV-4081","CleanRite Car Wash","$6,800","Apr 6","Apr 6 2:14pm","Nancy"],
                ["INV-4080","ParkValet Systems","$3,500","Apr 4","Apr 4 11:32am","Quentin"],
                ["INV-4079","SnackHaven Inc","$2,900","Apr 3","Apr 3 3:48pm","Manny"],
                ["INV-4078","WashWorld Canada","$8,100","Apr 2","Apr 2 10:22am","Henry"],
                ["INV-4077","CoinOp Laundry","$1,800","Apr 1","Apr 1 1:12pm","Karina"],
                ["INV-4076","EV Grid Solutions","$5,400","Mar 31","Mar 31 4:02pm","Brady"],
                ["INV-4075","QuickVend Co","$3,200","Mar 30","Mar 30 9:47am","Manny"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 5,
          name: "Scheduled Automated Reporting",
          slug: "scheduled-automated-reporting",
          status: "Not Started",
          who: "John",
          weekly_hours: "~1.5 hrs",
          monthly_hours: "~6 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Weekly rep activity report and monthly revenue vs. forecast delivered automatically.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Reports Delivered", value: "14", subtitle: "10 weekly + 4 monthly" },
              { label: "Report Build Time", value: "< 1 min", subtitle: "Was 1-2 hrs manual" },
              { label: "Revenue vs Target", value: "92%", subtitle: "Q1 2026 attainment" },
              { label: "Hours Saved/Week", value: "1.6", subtitle: "Target: 1-2 hrs" }
            ],
            summary: "Automated reporting has delivered 14 reports (10 weekly activity + 4 monthly revenue) with build time reduced from 1-2 hours to under a minute. Q1 revenue attainment stands at 92% of target. The 1.6 hours saved weekly frees John from manual Teleleads data pulls, and leadership now receives consistent, on-time reporting without prompting.",
            charts: [
              {
                id: "sm-revenue-vs-forecast",
                title: "Revenue vs Forecast ($K)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Actual Revenue", data: [42,48,52,58,64,70,76,82,86,92,98,104,108,114,118,124,128,134,138,142,148,152] },
                    { label: "Forecast", data: [45,50,55,60,65,72,78,84,90,96,102,108,114,120,126,132,138,144,150,156,162,168] }
                  ]
                }
              },
              {
                id: "sm-rep-activity-breakdown",
                title: "Weekly Rep Activity Summary",
                type: "stacked-bar",
                data: {
                  labels: ["Brady","Nancy","Karina","Quentin","Manny","Henry","Brendan"],
                  datasets: [
                    { label: "Calls Made", data: [42,38,35,32,40,28,25] },
                    { label: "Emails Sent", data: [65,58,52,48,62,40,35] },
                    { label: "Meetings Held", data: [8,6,5,4,7,4,3] }
                  ]
                }
              },
              {
                id: "sm-quarterly-attainment",
                title: "Monthly Revenue Attainment (%)",
                type: "bar",
                data: {
                  labels: ["Jan","Feb","Mar","Apr (proj)"],
                  datasets: [
                    { label: "Attainment", data: [88,91,94,92] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Leads Assigned","Leads Contacted","Deals in Pipeline","Revenue (Month)","% of Target"],
              rows: [
                ["Brady","12","11","4","$18,200","96%"],
                ["Nancy","10","9","3","$14,800","88%"],
                ["Karina","9","8","3","$12,400","82%"],
                ["Quentin","8","7","2","$10,600","78%"],
                ["Manny","11","10","4","$16,900","94%"],
                ["Henry","6","6","2","$9,800","92%"],
                ["Brendan","5","5","2","$8,200","86%"],
                ["Team Total","61","56","20","$90,900","88%"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 6,
          name: "Apollo to Teleleads Integration",
          slug: "apollo-to-teleleads-integration",
          status: "Not Started",
          who: "Reps",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "Medium",
          description: "Direct integration so qualified Apollo prospects auto-create in Teleleads. Deprioritized until adoption increases.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Apollo Active Users", value: "2", subtitle: "Below 3-rep threshold" },
              { label: "Records Synced", value: "0", subtitle: "Integration not active" },
              { label: "Manual Entries/Week", value: "4", subtitle: "Low volume" },
              { label: "Priority Status", value: "Deferred", subtitle: "Revisit when adoption grows" }
            ],
            summary: "Apollo to Teleleads integration remains deferred as only 2 reps actively use Apollo, below the 3-rep adoption threshold for justifying integration work. Current manual entry volume is approximately 4 records per week, representing negligible time impact. This will be revisited when Apollo adoption increases meaningfully across the team.",
            charts: [
              {
                id: "sm-apollo-usage",
                title: "Weekly Apollo Logins by Rep",
                type: "bar",
                data: {
                  labels: ["Brady","Nancy","Karina","Quentin","Manny","Henry","Brendan"],
                  datasets: [
                    { label: "Logins", data: [8,0,0,0,5,0,0] }
                  ]
                }
              },
              {
                id: "sm-apollo-manual-entries",
                title: "Manual Apollo-to-Teleleads Entries per Week",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Manual Entries", data: [1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Apollo Status","Weekly Usage","Manual Entries","Integration Need","Notes"],
              rows: [
                ["Brady","Active","Daily","2-3/week","Medium","Primary vending prospector"],
                ["Manny","Active","3-4x/week","1-2/week","Medium","Uses for car wash leads"],
                ["Nancy","Inactive","None","0","Low","Not trained"],
                ["Karina","Inactive","None","0","Low","Not trained"],
                ["Quentin","Inactive","None","0","Low","Not trained"],
                ["Henry","Inactive","None","0","Low","Canada-focused"],
                ["Brendan","Inactive","None","0","Low","Canada-focused"]
              ],
              badges: {
                1: {
                  "Active": "success",
                  "Inactive": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 7,
          name: "Outlook Email Integration with Teleleads",
          slug: "outlook-email-integration-with-teleleads",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~12 hrs",
          monthly_hours: "~48 hrs",
          complexity: "Medium",
          impact: "High",
          description: "Enable reps to send and log emails directly from Teleleads, eliminating toggle and manual logging.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Emails Logged/Day", value: "62", subtitle: "Across all reps" },
              { label: "Toggle Eliminated", value: "Yes", subtitle: "Send from Teleleads" },
              { label: "CRM Data Gaps", value: "12%", subtitle: "Down from 45%" },
              { label: "Hours Saved/Week", value: "11.2", subtitle: "Target: 10-14 hrs" }
            ],
            summary: "Outlook integration with Teleleads logs 62 emails daily with CRM data gaps reduced from 45% to 12%. The toggle between Outlook and Teleleads has been eliminated, saving 11.2 hours per week across the team. CRM data quality has improved significantly as logging is now automatic rather than dependent on rep discipline.",
            charts: [
              {
                id: "sm-email-logging-trend",
                title: "Daily Emails Auto-Logged in Teleleads",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Auto-Logged", data: [24,28,32,35,38,40,42,44,46,48,50,52,54,55,56,58,58,60,60,62,62,62] }
                  ]
                }
              },
              {
                id: "sm-crm-data-gaps",
                title: "CRM Activity Logging Completeness (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Completeness", data: [55,58,60,62,65,68,70,72,74,76,78,80,82,83,84,85,86,86,87,87,88,88] }
                  ]
                }
              },
              {
                id: "sm-rep-email-volume",
                title: "Email Volume by Rep (Daily Average)",
                type: "horizontal-bar",
                data: {
                  labels: ["Brady","Nancy","Karina","Quentin","Manny","Henry","Brendan"],
                  datasets: [
                    { label: "Emails/Day", data: [12,10,8,7,11,8,6] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Emails/Day","Auto-Logged %","Manual Log %","Data Gaps","Time Saved/Week"],
              rows: [
                ["Brady","12","96%","4%","8%","1.9 hrs"],
                ["Nancy","10","94%","6%","10%","1.6 hrs"],
                ["Karina","8","92%","8%","12%","1.3 hrs"],
                ["Quentin","7","90%","10%","14%","1.1 hrs"],
                ["Manny","11","95%","5%","9%","1.8 hrs"],
                ["Henry","8","93%","7%","11%","1.3 hrs"],
                ["Brendan","6","91%","9%","15%","1.0 hrs"],
                ["Team Total","62","93%","7%","12%","11.2 hrs"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 8,
          name: "Document Submission Guidance & Checklist Automation",
          slug: "document-submission-guidance-checklist-automation",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~0.5 hrs",
          monthly_hours: "~2.1 hrs",
          complexity: "Low",
          impact: "Medium",
          description: "Automated customer-facing onboarding checklist triggered after DocuSign with inline instructions and reminders.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Checklists Sent", value: "32", subtitle: "This month auto-triggered" },
              { label: "First-Attempt Success", value: "74%", subtitle: "Up from 40%" },
              { label: "Follow-Up Touchpoints", value: "0.8/deal", subtitle: "Down from 2-3/deal" },
              { label: "Weekly Time Saved", value: "38 min", subtitle: "Target: 20-45 min" }
            ],
            summary: "Document submission automation has sent 32 checklists this month with first-attempt success rate improving from 40% to 74% through inline guidance on common errors. Follow-up touchpoints per deal dropped from 2-3 to 0.8, and the 38 minutes saved weekly falls within the 20-45 minute target. Legal name and banking mismatch errors have been dramatically reduced.",
            charts: [
              {
                id: "sm-checklist-success",
                title: "First-Attempt Document Submission Success Rate (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Success Rate", data: [40,42,45,48,50,52,55,58,60,62,64,65,66,68,68,70,70,72,72,73,74,74] }
                  ]
                }
              },
              {
                id: "sm-followup-reduction",
                title: "Follow-Up Touchpoints per Deal",
                type: "bar",
                data: {
                  labels: ["Jan","Feb","Mar W1","Mar W2","Mar W3","Mar W4","Apr W1"],
                  datasets: [
                    { label: "Touchpoints", data: [2.8,2.4,2.0,1.6,1.2,0.9,0.8] }
                  ]
                }
              },
              {
                id: "sm-doc-error-reduction",
                title: "Common Document Errors (Monthly Count)",
                type: "stacked-bar",
                data: {
                  labels: ["Jan","Feb","Mar","Apr (proj)"],
                  datasets: [
                    { label: "Legal Name Mismatch", data: [12,8,4,2] },
                    { label: "Banking Mismatch", data: [10,7,3,1] },
                    { label: "Missing Documents", data: [8,6,4,3] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Customer","DocuSign Date","Checklist Sent","Docs Complete","Follow-Ups","Status"],
              rows: [
                ["NorthStar Vending","Apr 5","Apr 5 auto","Apr 6","0","Complete"],
                ["CleanRite Car Wash","Apr 4","Apr 4 auto","Apr 5","1","Complete"],
                ["ParkValet Systems","Apr 3","Apr 3 auto","Pending","0","Awaiting Docs"],
                ["SnackHaven Inc","Apr 2","Apr 2 auto","Apr 2","0","Complete"],
                ["WashWorld Canada","Apr 1","Apr 1 auto","Apr 3","2","Complete"],
                ["CoinOp Laundry","Mar 31","Mar 31 auto","Apr 1","1","Complete"],
                ["EV Grid Solutions","Mar 28","Mar 28 auto","Mar 29","0","Complete"],
                ["QuickVend Co","Mar 27","Mar 27 auto","Pending","1","Reminder Sent"]
              ],
              badges: {
                5: {
                  "Complete": "success",
                  "Awaiting Docs": "warning",
                  "Reminder Sent": "info"
                }
              }
            }
          }
        },
        {
          rank: 9,
          name: "Admin Re-Keying Automation (Phorge + Acquirer + Hardware)",
          slug: "admin-re-keying-automation-phorge-acquirer-hardware",
          status: "Not Started",
          who: "Admin team",
          weekly_hours: "~70 hrs",
          monthly_hours: "~280 hrs",
          complexity: "High",
          impact: "Critical",
          description: "Automated data pipeline pushing approved deal data to Phorge, acquirer, and hardware systems without re-entry.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Transactions/Week", value: "192", subtitle: "Both entities combined" },
              { label: "Automation Rate", value: "38%", subtitle: "Phorge only so far" },
              { label: "Hours Saved/Week", value: "42", subtitle: "Target: 65-75 hrs" },
              { label: "Error Rate Reduction", value: "62%", subtitle: "vs manual re-keying" }
            ],
            summary: "Admin re-keying automation processes 192 transactions weekly across both entities with Phorge integration achieving 38% automation rate. The 42 hours saved weekly is progressing toward the 65-75 hour target as acquirer and hardware system integrations are built. Error rates have dropped 62% compared to manual entry, reducing Castles programming errors downstream.",
            charts: [
              {
                id: "sm-rekeying-volume",
                title: "Weekly Transaction Volume by System",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Phorge", data: [12,14,11,15,13,14,12,16,13,15,14,16,12,15,13,14,16,13,15,14,12,15] },
                    { label: "Acquirer", data: [10,12,9,13,11,12,10,14,11,13,12,14,10,13,11,12,14,11,13,12,10,13] },
                    { label: "Hardware", data: [6,8,5,9,7,8,6,10,7,9,8,10,6,9,7,8,10,7,9,8,6,9] }
                  ]
                }
              },
              {
                id: "sm-automation-progress",
                title: "Automation Rate by System (%)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Phorge", data: [10,12,15,18,20,22,24,26,28,30,30,32,32,34,34,36,36,36,38,38,38,38] },
                    { label: "Acquirer", data: [0,0,0,0,0,2,4,5,6,8,10,12,14,15,16,18,18,20,20,22,22,24] },
                    { label: "Hardware", data: [0,0,0,0,0,0,0,0,0,0,2,4,5,6,8,8,10,10,12,12,14,14] }
                  ]
                }
              },
              {
                id: "sm-hours-saved-rekeying",
                title: "Weekly Admin Hours: Manual vs Automated",
                type: "stacked-bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5"],
                  datasets: [
                    { label: "Still Manual", data: [128,118,108,100,93] },
                    { label: "Automated", data: [12,22,32,40,42] }
                  ]
                }
              },
              {
                id: "sm-error-rate-comparison",
                title: "Error Rate: Manual vs Automated (%)",
                type: "bar",
                data: {
                  labels: ["Phorge","Acquirer","Hardware","Overall"],
                  datasets: [
                    { label: "Manual Entry", data: [8.2,6.5,12.4,9.0] },
                    { label: "Automated", data: [2.8,3.1,5.2,3.4] }
                  ]
                }
              }
            ],
            table: {
              columns: ["System","Transactions/Week","Automated %","Manual %","Avg Time (Manual)","Errors/Week"],
              rows: [
                ["Phorge","72","38%","62%","22 min","3"],
                ["Acquirer System","64","24%","76%","18 min","4"],
                ["Hardware/Castles","38","14%","86%","28 min","5"],
                ["Conversions","12","0%","100%","35 min","2"],
                ["Upgrades","6","0%","100%","15 min","1"],
                ["Total","192","26%","74%","24 min avg","15"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 10,
          name: "Car Wash & Vending Lead Intelligence Tool",
          slug: "car-wash-vending-lead-intelligence-tool",
          status: "Not Started",
          who: "Brady, Nancy, Karina, Quentin, Manny",
          weekly_hours: "Variable",
          monthly_hours: "Variable",
          complexity: "Medium",
          impact: "High",
          description: "Targeted lead intelligence source for car wash and vending operators beyond Apollo's limited coverage.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "New Leads Sourced", value: "218", subtitle: "From alternative channels" },
              { label: "Data Sources Active", value: "4", subtitle: "Trade shows, forums, groups" },
              { label: "Car Wash Coverage", value: "3.2x", subtitle: "vs Apollo alone" },
              { label: "Pipeline Value Added", value: "$142K", subtitle: "From new lead sources" }
            ],
            summary: "Alternative lead intelligence has sourced 218 new prospects across 4 active channels, expanding car wash coverage to 3.2x what Apollo provides alone. Trade show attendee lists from SWCA, ICA, and NE Car Wash have been the highest-converting source, contributing $142K in pipeline value. Facebook group and forum scraping has added a steady stream of vending operator contacts.",
            charts: [
              {
                id: "sm-lead-sources",
                title: "Lead Volume by Source",
                type: "doughnut",
                data: {
                  labels: ["Trade Show Lists","Facebook Groups","Forum Contacts","Data Vendor","Apollo"],
                  datasets: [{ data: [82,58,42,36,28] }]
                }
              },
              {
                id: "sm-lead-quality",
                title: "Weekly New Leads by Quality Score",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "High Quality", data: [2,3,2,4,3,3,4,3,4,3,4,3,5,4,3,4,3,5,4,3,4,5] },
                    { label: "Medium Quality", data: [4,5,3,6,5,4,5,4,6,5,5,4,6,5,4,5,4,6,5,4,5,6] },
                    { label: "Low Quality", data: [2,1,3,2,1,2,1,2,2,1,2,1,1,2,1,2,1,1,2,1,1,1] }
                  ]
                }
              },
              {
                id: "sm-vertical-pipeline",
                title: "Pipeline Value by Vertical ($K)",
                type: "bar",
                data: {
                  labels: ["Car Wash","Vending","Parking","EV Charging","Laundromat","Amusement"],
                  datasets: [
                    { label: "Pipeline Value", data: [52,38,22,16,8,6] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Source","Channel","Leads Added","Qualified","Conversion Rate","Best Vertical"],
              rows: [
                ["SWCA Attendee List","Trade Show","32","12","38%","Car Wash"],
                ["ICA Member Directory","Trade Show","28","8","29%","Car Wash"],
                ["NE Car Wash Expo","Trade Show","22","7","32%","Car Wash"],
                ["Car Wash Owners Group","Facebook","34","6","18%","Car Wash"],
                ["Vending Operators Forum","Forum","26","5","19%","Vending"],
                ["Coin-Op Community","Facebook","24","4","17%","Laundromat"],
                ["Data Axle Extract","Vendor","36","8","22%","Mixed"],
                ["Apollo Standard","Platform","28","4","14%","Vending"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 11,
          name: "Vertical-Based Application Templates",
          slug: "vertical-based-application-templates",
          status: "Not Started",
          who: "Reps",
          weekly_hours: "~0.3 hrs",
          monthly_hours: "~1.3 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Standardized templates by vertical that auto-populate key parameters for new account applications.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Templates Created", value: "6", subtitle: "Covering major verticals" },
              { label: "Template Usage Rate", value: "82%", subtitle: "Of new applications" },
              { label: "Setup Time Saved", value: "18 min/app", subtitle: "Down from 25 min" },
              { label: "Config Errors", value: "2%", subtitle: "Down from 11%" }
            ],
            summary: "Six vertical-based templates are now live covering Vending, Car Wash, Amusement, Parking, Air/Vac, and EV Charging. Template usage has reached 82% of new applications with setup time reduced by 18 minutes per application. Configuration errors have dropped from 11% to 2% through standardized fee structures and auto-populated parameters.",
            charts: [
              {
                id: "sm-template-usage",
                title: "Template Usage by Vertical",
                type: "horizontal-bar",
                data: {
                  labels: ["Snacks/Soda Vending","Car Wash","Amusements","Parking","Air/Vac","EV Charging"],
                  datasets: [
                    { label: "Applications", data: [18,14,8,6,4,3] }
                  ]
                }
              },
              {
                id: "sm-template-adoption",
                title: "Template vs Manual Application Setup",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Template Used %", data: [40,45,48,52,55,58,62,65,68,70,72,74,76,78,78,80,80,82,82,82,82,82] },
                    { label: "Manual Setup %", data: [60,55,52,48,45,42,38,35,32,30,28,26,24,22,22,20,20,18,18,18,18,18] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Template","Vertical","Applications","Avg Setup Time","Error Rate","PULSE Pricing"],
              rows: [
                ["Snacks/Soda Standard","Vending","18","6 min","1%","Standard"],
                ["Car Wash Full Service","Car Wash","14","8 min","2%","Modified"],
                ["Amusement Package","Amusements","8","7 min","3%","Standard"],
                ["Parking Meter","Parking","6","5 min","1%","Standard"],
                ["Air/Vac Station","Air/Vac","4","5 min","2%","Standard"],
                ["EV Charging Point","EV Charging","3","9 min","4%","Custom"],
                ["Manual (No Template)","Mixed","10","25 min","11%","Varies"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 12,
          name: "Rapid Order Processing for Existing Accounts",
          slug: "rapid-order-processing-for-existing-accounts",
          status: "Not Started",
          who: "Reps",
          weekly_hours: "~0.25 hrs",
          monthly_hours: "~1 hr",
          complexity: "Low",
          impact: "Medium",
          description: "Auto-populate known account details for repeat orders with dropdown-based ordering in ~20 seconds.",
          reporting: {
            layout: "standard",
            stat_cards: [
              { label: "Repeat Orders Processed", value: "14", subtitle: "This month" },
              { label: "Avg Order Time", value: "28 sec", subtitle: "Target: 20 sec" },
              { label: "Customer Satisfaction", value: "4.6/5", subtitle: "Order experience rating" },
              { label: "Time Saved/Week", value: "16 min", subtitle: "Target: 10-20 min" }
            ],
            summary: "Rapid order processing has handled 14 repeat orders this month with average order generation time at 28 seconds, approaching the 20-second target. Customer satisfaction for the ordering experience sits at 4.6 out of 5. The 16 minutes saved weekly comes from eliminating manual form completion and data re-entry for existing accounts with known details.",
            charts: [
              {
                id: "sm-order-speed",
                title: "Order Processing Time: New vs Rapid (Seconds)",
                type: "bar",
                data: {
                  labels: ["Week 1","Week 2","Week 3","Week 4","Week 5"],
                  datasets: [
                    { label: "Standard Process", data: [720,720,720,720,720] },
                    { label: "Rapid Process", data: [45,38,32,30,28] }
                  ]
                }
              },
              {
                id: "sm-repeat-order-volume",
                title: "Weekly Repeat Order Volume",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Repeat Orders", data: [0,1,0,1,0,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,0,1] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Order","Customer","Items","Order Time","Method","Status"],
              rows: [
                ["RPT-042","National Vending Corp","3 terminals","24 sec","Rapid","Shipped"],
                ["RPT-041","Metro Retail Group","2 terminals","28 sec","Rapid","Shipped"],
                ["RPT-040","AutoWash Enterprises","1 terminal + parts","32 sec","Rapid","Processing"],
                ["RPT-039","LaundroKing Chain","4 terminals","26 sec","Rapid","Shipped"],
                ["RPT-038","QuickCharge EV","2 terminals","30 sec","Rapid","Shipped"],
                ["RPT-037","ParkSmart Systems","1 terminal","22 sec","Rapid","Shipped"],
                ["RPT-036","SnackMaster Inc","3 terminals","28 sec","Rapid","Shipped"],
                ["RPT-035","FunZone Amusements","2 terminals + parts","35 sec","Rapid","Processing"]
              ],
              badges: {
                5: {
                  "Shipped": "success",
                  "Processing": "warning",
                  "Pending": "neutral"
                }
              }
            }
          }
        },
        {
          rank: 13,
          name: "Contract Automation",
          slug: "contract-automation",
          status: "Not Started",
          who: "Admin",
          weekly_hours: "~0.4 hrs",
          monthly_hours: "~1.65 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Auto-generate agreements from submitted deal information and compile supporting forms.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Contracts Generated", value: "22", subtitle: "This month auto-compiled" },
              { label: "Generation Time", value: "6 min", subtitle: "Down from 25 min" },
              { label: "Forms Auto-Compiled", value: "94%", subtitle: "Supporting docs included" },
              { label: "Weekly Time Saved", value: "28 min", subtitle: "Target: 20-30 min" }
            ],
            summary: "Contract automation has generated 22 agreements this month with generation time reduced from 25 to 6 minutes. Supporting form compilation is 94% automated with the system correctly identifying required documents by vertical and deal type. The 28 minutes saved weekly falls within the 20-30 minute target, freeing admin time for compliance review.",
            charts: [
              {
                id: "sm-contract-volume",
                title: "Weekly Contract Generation",
                type: "bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Auto-Generated", data: [0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1] },
                    { label: "Manual", data: [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0] }
                  ]
                }
              },
              {
                id: "sm-contract-gen-time",
                title: "Contract Generation Time Trend (Minutes)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Generation Time", data: [25,22,20,18,16,14,12,11,10,9,9,8,8,7,7,7,6,6,6,6,6,6] }
                  ]
                }
              },
              {
                id: "sm-contract-forms",
                title: "Supporting Forms Compilation",
                type: "doughnut",
                data: {
                  labels: ["Auto-Compiled","Manual Addition","Not Required"],
                  datasets: [{ data: [94,4,2] }]
                }
              }
            ],
            table: {
              columns: ["Contract ID","Customer","Vertical","Forms Included","Generation Time","Status"],
              rows: [
                ["CTR-1082","NorthStar Vending","Vending","5/5","5 min","Signed"],
                ["CTR-1081","CleanRite Car Wash","Car Wash","6/6","6 min","Sent"],
                ["CTR-1080","ParkValet Systems","Parking","4/4","5 min","Signed"],
                ["CTR-1079","SnackHaven Inc","Vending","5/5","6 min","Signed"],
                ["CTR-1078","WashWorld Canada","Car Wash","6/6","7 min","Review"],
                ["CTR-1077","CoinOp Laundry","Laundromat","5/5","6 min","Signed"],
                ["CTR-1076","EV Grid Solutions","EV Charging","7/7","8 min","Sent"],
                ["CTR-1075","QuickVend Co","Vending","5/5","5 min","Signed"]
              ],
              badges: {
                5: {
                  "Signed": "success",
                  "Sent": "info",
                  "Review": "warning"
                }
              }
            }
          }
        },
        {
          rank: 14,
          name: "AI-Powered Sales Communication",
          slug: "ai-powered-sales-communication",
          status: "Not Started",
          who: "All reps",
          weekly_hours: "~1.4 hrs",
          monthly_hours: "~5.6 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Generate non-repetitive cold outreach, assist with objection handling, and draft responses for sensitive situations.",
          reporting: {
            layout: "chart-heavy",
            stat_cards: [
              { label: "Drafts Generated/Week", value: "84", subtitle: "Across all reps" },
              { label: "Acceptance Rate", value: "68%", subtitle: "Used as-is or minor edit" },
              { label: "Response Rate Improvement", value: "+12%", subtitle: "vs manual outreach" },
              { label: "Weekly Time Saved", value: "1.2 hrs", subtitle: "Target: 50-125 min" }
            ],
            summary: "AI-powered sales communication generates 84 drafts weekly with a 68% acceptance rate. Prospect response rates have improved 12% compared to manually written outreach through personalized, non-repetitive messaging. The 1.2 hours saved weekly is within the lower end of the 50-125 minute target, with objection handling templates providing additional value in deal negotiations.",
            charts: [
              {
                id: "sm-draft-volume",
                title: "Daily AI Draft Generation by Type",
                type: "stacked-bar",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Cold Outreach", data: [4,5,3,6,4,5,4,6,5,4,5,6,4,5,4,6,5,4,5,4,5,6] },
                    { label: "Follow-Up", data: [3,4,2,5,3,4,3,5,4,3,4,5,3,4,3,5,4,3,4,3,4,5] },
                    { label: "Objection Response", data: [1,1,1,2,1,1,2,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1] },
                    { label: "Escalation/Sensitive", data: [0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1] }
                  ]
                }
              },
              {
                id: "sm-response-rate-comparison",
                title: "Prospect Response Rate: AI vs Manual (%)",
                type: "multi-line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "AI-Drafted", data: [14,15,16,16,17,18,18,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26] },
                    { label: "Manual", data: [14,14,14,13,14,14,13,14,14,13,14,14,13,14,14,13,14,14,13,14,14,14] }
                  ]
                }
              },
              {
                id: "sm-draft-acceptance",
                title: "AI Draft Usage Breakdown",
                type: "doughnut",
                data: {
                  labels: ["Used As-Is","Minor Edits","Major Rewrite","Discarded"],
                  datasets: [{ data: [38,30,20,12] }]
                }
              }
            ],
            table: {
              columns: ["Draft Type","Volume/Week","Acceptance Rate","Avg Edit Time","Response Rate"],
              rows: [
                ["Cold Outreach - Vending","18","72%","2 min","24%"],
                ["Cold Outreach - Car Wash","14","65%","3 min","22%"],
                ["Follow-Up Sequence","22","74%","1 min","32%"],
                ["Objection Handling","12","62%","4 min","N/A"],
                ["Escalation Response","6","58%","5 min","N/A"],
                ["Meeting Request","8","70%","2 min","28%"],
                ["Post-Demo Follow-Up","4","78%","1 min","35%"]
              ],
              badges: {}
            }
          }
        },
        {
          rank: 15,
          name: "Automated Commission Tracking",
          slug: "automated-commission-tracking",
          status: "Not Started",
          who: "All reps, Admin",
          weekly_hours: "~0.5 hrs",
          monthly_hours: "~1.85 hrs",
          complexity: "Medium",
          impact: "Medium",
          description: "Track submitted deals and calculate commissions automatically with internal review before accounting submission.",
          reporting: {
            layout: "table-first",
            stat_cards: [
              { label: "Deals Tracked", value: "48", subtitle: "Active commission pool" },
              { label: "Calculation Accuracy", value: "97.8%", subtitle: "vs manual at 91%" },
              { label: "Monthly Processing Time", value: "22 min", subtitle: "Down from 2.5 hrs" },
              { label: "Monthly Time Saved", value: "128 min", subtitle: "Target: 90-150 min" }
            ],
            summary: "Automated commission tracking covers 48 active deals with calculation accuracy at 97.8%, up from 91% with manual processing. Monthly processing time has dropped from 2.5 hours to 22 minutes, saving 128 minutes per month. Reps now have real-time visibility into their commission status without waiting for end-of-month compilation.",
            charts: [
              {
                id: "sm-commission-accuracy",
                title: "Commission Calculation Accuracy Over Time (%)",
                type: "line",
                data: {
                  labels: ["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 6","Apr 7"],
                  datasets: [
                    { label: "Automated Accuracy", data: [93,93.5,94,94.5,95,95.2,95.5,95.8,96,96.2,96.5,96.8,97,97,97.2,97.2,97.4,97.5,97.5,97.6,97.8,97.8] },
                    { label: "Manual Baseline", data: [91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91] }
                  ]
                }
              },
              {
                id: "sm-commission-by-rep",
                title: "Monthly Commission by Rep ($)",
                type: "bar",
                data: {
                  labels: ["Brady","Nancy","Karina","Quentin","Manny","Henry","Brendan"],
                  datasets: [
                    { label: "Commission", data: [4200,3400,2800,2200,3800,2600,1800] }
                  ]
                }
              },
              {
                id: "sm-commission-processing",
                title: "Monthly Commission Processing Time (Minutes)",
                type: "bar",
                data: {
                  labels: ["Oct","Nov","Dec","Jan","Feb","Mar"],
                  datasets: [
                    { label: "Processing Time", data: [165,155,140,95,55,22] }
                  ]
                }
              }
            ],
            table: {
              columns: ["Rep","Deals Closed","Commission Earned","Rate Applied","Adjustments","Status"],
              rows: [
                ["Brady","8","$4,200","Standard Vending","0","Approved"],
                ["Nancy","6","$3,400","Car Wash Rate","0","Approved"],
                ["Karina","5","$2,800","Car Wash Rate","1","Under Review"],
                ["Quentin","4","$2,200","Car Wash Rate","0","Approved"],
                ["Manny","7","$3,800","Mixed Rate","0","Approved"],
                ["Henry","4","$2,600","Canada Attended","1","Under Review"],
                ["Brendan","3","$1,800","Canada Attended","0","Approved"],
                ["Team Total","37","$20,800","Various","2","Pending Final"]
              ],
              badges: {
                5: {
                  "Approved": "success",
                  "Under Review": "warning",
                  "Pending Final": "info"
                }
              }
            }
          }
        }
      ],
    }

  ]
};
