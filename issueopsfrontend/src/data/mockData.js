export const mockUsers = [
  { id: 'u1', name: 'Harithik Reddy', email: 'harithik@waterquality.dev', avatar: null, initials: 'HR' },
  { id: 'u2', name: 'Rohan Sharma',   email: 'rohan@waterquality.dev',   avatar: null, initials: 'RS' },
  { id: 'u3', name: 'Priya Nair',     email: 'priya@waterquality.dev',   avatar: null, initials: 'PN' },
  { id: 'u4', name: 'Arjun Mehta',    email: 'arjun@waterquality.dev',   avatar: null, initials: 'AM' },
  { id: 'u5', name: 'Kavya Patel',    email: 'kavya@waterquality.dev',   avatar: null, initials: 'KP' },
];

export const currentUser = mockUsers[0];

export const mockWorkspaces = [
  {
    id: 'ws1',
    name: 'Water Quality Monitoring Team',
    description: 'ML-driven water safety analysis using IoT sensors and predictive risk models.',
    memberCount: 5,
    projectCount: 4,
    role: 'OWNER',
    createdAt: '2024-11-01T09:00:00Z',
    slug: 'wqmt',
  },
  {
    id: 'ws2',
    name: 'Campus DevClub',
    description: 'Internal tooling and open-source projects for the college dev community.',
    memberCount: 12,
    projectCount: 6,
    role: 'ADMIN',
    createdAt: '2024-09-15T08:00:00Z',
    slug: 'devclub',
  },
];

export const mockProjects = [
  { id: 'p1', workspaceId: 'ws1', name: 'Backend API',         description: 'Node.js REST API with sensor endpoints and auth middleware.', status: 'ACTIVE',   totalIssues: 14, completedIssues: 9,  deadline: '2025-03-20T00:00:00Z', color: '#3b82f6' },
  { id: 'p2', workspaceId: 'ws1', name: 'Sensor Integration',  description: 'ESP32 firmware to collect pH, TDS, and turbidity readings.',   status: 'ACTIVE',   totalIssues: 11, completedIssues: 5,  deadline: '2025-03-25T00:00:00Z', color: '#10b981' },
  { id: 'p3', workspaceId: 'ws1', name: 'React Dashboard',     description: 'Frontend for visualising live sensor data and alerts.',          status: 'ACTIVE',   totalIssues: 18, completedIssues: 7,  deadline: '2025-04-01T00:00:00Z', color: '#8b5cf6' },
  { id: 'p4', workspaceId: 'ws1', name: 'ML Risk Model',       description: 'Binary classifier: safe / moderate / unsafe water quality.',     status: 'PLANNING', totalIssues: 8,  completedIssues: 1,  deadline: '2025-04-10T00:00:00Z', color: '#f59e0b' },
];

export const mockIssues = [
  { id: 'ISS-001', projectId: 'p1', title: 'Build sensor readings API', description: 'Create REST endpoints to receive, validate, and store sensor readings from ESP32 devices. Include field-level validation for pH (0–14), TDS (0–9999 ppm), turbidity (0–4000 NTU), and temperature (−10–80 °C).', status: 'DONE',        priority: 'HIGH',   type: 'FEATURE',  assignee: mockUsers[0], reporter: mockUsers[1], dueDate: '2025-02-10T00:00:00Z', labels: ['backend', 'sensor'], commentCount: 5, createdAt: '2025-01-15T09:00:00Z', updatedAt: '2025-02-09T14:20:00Z' },
  { id: 'ISS-002', projectId: 'p2', title: 'Connect pH sensor to ESP32', description: 'Wire Atlas Scientific EZO-pH circuit to ESP32 GPIO and implement I²C polling every 30 s. Calibrate with pH 4/7/10 buffer solutions.', status: 'IN_PROGRESS', priority: 'HIGH',   type: 'TASK',     assignee: mockUsers[1], reporter: mockUsers[0], dueDate: '2025-02-20T00:00:00Z', labels: ['hardware', 'sensor'], commentCount: 3, createdAt: '2025-01-18T10:00:00Z', updatedAt: '2025-02-14T11:00:00Z' },
  { id: 'ISS-003', projectId: 'p3', title: 'Create QR-based dashboard page', description: 'Design a page accessible via QR code that shows live readings for a single water monitoring station. No login required for read-only view.', status: 'TODO',        priority: 'MEDIUM', type: 'FEATURE',  assignee: mockUsers[2], reporter: mockUsers[0], dueDate: '2025-03-01T00:00:00Z', labels: ['frontend', 'public'], commentCount: 2, createdAt: '2025-01-22T08:30:00Z', updatedAt: '2025-01-22T08:30:00Z' },
  { id: 'ISS-004', projectId: 'p4', title: 'Train safe/moderate/unsafe classifier', description: 'Use scikit-learn RandomForest on WHO water quality dataset. Target accuracy ≥ 92% on test split. Export model as ONNX for serving.', status: 'IN_PROGRESS', priority: 'URGENT', type: 'RESEARCH',  assignee: mockUsers[3], reporter: mockUsers[2], dueDate: '2025-02-28T00:00:00Z', labels: ['ml', 'python'], commentCount: 7, createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-02-13T16:40:00Z' },
  { id: 'ISS-005', projectId: 'p1', title: 'Write final report section', description: 'Complete the methodology chapter covering data pipeline architecture, model training, and evaluation metrics.', status: 'TODO',        priority: 'MEDIUM', type: 'DOCUMENTATION', assignee: mockUsers[4], reporter: mockUsers[0], dueDate: '2025-04-05T00:00:00Z', labels: ['docs'], commentCount: 0, createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z' },
  { id: 'ISS-006', projectId: 'p1', title: 'Fix authentication middleware', description: 'JWT expiry check is not working correctly on refresh token rotation. Session gets invalidated prematurely.', status: 'BLOCKED',     priority: 'URGENT', type: 'BUG',       assignee: mockUsers[0], reporter: mockUsers[1], dueDate: '2025-02-18T00:00:00Z', labels: ['auth', 'bug'], commentCount: 4, createdAt: '2025-02-10T12:00:00Z', updatedAt: '2025-02-14T09:15:00Z' },
  { id: 'ISS-007', projectId: 'p1', title: 'Add MongoDB schema validation', description: 'Define JSON Schema validators in Mongoose models for SensorReading and Alert collections. Reject malformed docs at DB level.', status: 'IN_REVIEW',  priority: 'HIGH',   type: 'IMPROVEMENT', assignee: mockUsers[1], reporter: mockUsers[0], dueDate: '2025-02-22T00:00:00Z', labels: ['backend', 'database'], commentCount: 2, createdAt: '2025-02-05T09:00:00Z', updatedAt: '2025-02-14T13:00:00Z' },
  { id: 'ISS-008', projectId: 'p3', title: 'Implement alert threshold UI', description: 'Admin panel widget to configure per-station alert thresholds for each metric. Changes persist to backend.', status: 'BACKLOG',     priority: 'LOW',    type: 'FEATURE',  assignee: null,         reporter: mockUsers[2], dueDate: '2025-03-15T00:00:00Z', labels: ['frontend'], commentCount: 0, createdAt: '2025-02-12T08:00:00Z', updatedAt: '2025-02-12T08:00:00Z' },
  { id: 'ISS-009', projectId: 'p2', title: 'Add offline queue for readings', description: 'If WiFi is unavailable, buffer readings in ESP32 SPIFFS and flush when reconnected.', status: 'TODO',        priority: 'HIGH',   type: 'FEATURE',  assignee: mockUsers[1], reporter: mockUsers[3], dueDate: '2025-03-05T00:00:00Z', labels: ['hardware', 'offline'], commentCount: 1, createdAt: '2025-02-08T11:00:00Z', updatedAt: '2025-02-08T11:00:00Z' },
  { id: 'ISS-010', projectId: 'p3', title: 'Recharts time-series graph', description: 'Show last 24h of sensor readings as smooth line chart with zoom. Use Recharts.', status: 'DONE',        priority: 'MEDIUM', type: 'FEATURE',  assignee: mockUsers[2], reporter: mockUsers[0], dueDate: '2025-02-15T00:00:00Z', labels: ['frontend', 'charts'], commentCount: 3, createdAt: '2025-01-28T10:00:00Z', updatedAt: '2025-02-13T17:00:00Z' },
];

export const mockComments = [
  { id: 'c1', issueId: 'ISS-001', author: mockUsers[1], content: 'Endpoints look good. Should we add rate limiting per device ID?', createdAt: '2025-02-05T10:00:00Z', updatedAt: '2025-02-05T10:00:00Z' },
  { id: 'c2', issueId: 'ISS-001', author: mockUsers[0], content: '@Rohan Sharma yes, I\'ll use express-rate-limit scoped per device in the next PR.', createdAt: '2025-02-05T10:45:00Z', updatedAt: '2025-02-05T10:45:00Z' },
  { id: 'c3', issueId: 'ISS-006', author: mockUsers[1], content: 'Reproduced. The issue is in the refresh token comparison — using == instead of crypto.timingSafeEqual.', createdAt: '2025-02-12T14:00:00Z', updatedAt: '2025-02-12T14:00:00Z' },
  { id: 'c4', issueId: 'ISS-006', author: mockUsers[0], content: '@Rohan Sharma please review this API once I push the fix.', createdAt: '2025-02-14T09:00:00Z', updatedAt: '2025-02-14T09:00:00Z' },
];

export const mockActivity = [
  { id: 'a1', issueId: 'ISS-001', actor: mockUsers[0], action: 'created this issue', createdAt: '2025-01-15T09:00:00Z' },
  { id: 'a2', issueId: 'ISS-001', actor: mockUsers[1], action: 'changed status from TODO to IN_PROGRESS', createdAt: '2025-01-20T11:00:00Z' },
  { id: 'a3', issueId: 'ISS-001', actor: mockUsers[2], action: 'assigned this issue to Harithik Reddy', createdAt: '2025-01-22T14:00:00Z' },
  { id: 'a4', issueId: 'ISS-001', actor: mockUsers[0], action: 'added label backend', createdAt: '2025-01-25T09:30:00Z' },
  { id: 'a5', issueId: 'ISS-001', actor: mockUsers[1], action: 'changed status from IN_PROGRESS to DONE', createdAt: '2025-02-09T14:20:00Z' },
];

export const mockNotifications = [
  { id: 'n1', type: 'MENTION',            title: 'You were mentioned',       message: 'Rohan mentioned you in ISS-006: "@Harithik please review this API."', read: false, createdAt: '2025-02-14T09:01:00Z', link: '/issues/ISS-006' },
  { id: 'n2', type: 'ASSIGNMENT',         title: 'Issue assigned to you',    message: 'ISS-004 "Train safe/moderate/unsafe classifier" was assigned to you.', read: false, createdAt: '2025-02-13T16:00:00Z', link: '/issues/ISS-004' },
  { id: 'n3', type: 'STATUS_CHANGE',      title: 'Status changed',           message: 'ISS-007 moved to IN_REVIEW by Rohan Sharma.', read: false, createdAt: '2025-02-14T13:00:00Z', link: '/issues/ISS-007' },
  { id: 'n4', type: 'DUE_DATE_REMINDER',  title: 'Due tomorrow',             message: 'ISS-002 "Connect pH sensor to ESP32" is due tomorrow.', read: true,  createdAt: '2025-02-13T08:00:00Z', link: '/issues/ISS-002' },
  { id: 'n5', type: 'AUTOMATION_ALERT',   title: 'Automation triggered',     message: 'Rule "Notify on BLOCKED" fired for ISS-006.', read: true,  createdAt: '2025-02-10T12:05:00Z', link: '/automation' },
  { id: 'n6', type: 'WORKSPACE_INVITE',   title: 'Workspace invite accepted', message: 'Kavya Patel joined Water Quality Monitoring Team.', read: true,  createdAt: '2025-02-01T09:00:00Z', link: '/workspaces/ws1' },
];

export const mockMembers = [
  { id: 'wm1', workspaceId: 'ws1', user: mockUsers[0], role: 'OWNER',  joinedAt: '2024-11-01T09:00:00Z' },
  { id: 'wm2', workspaceId: 'ws1', user: mockUsers[1], role: 'ADMIN',  joinedAt: '2024-11-02T10:00:00Z' },
  { id: 'wm3', workspaceId: 'ws1', user: mockUsers[2], role: 'MEMBER', joinedAt: '2024-11-05T11:00:00Z' },
  { id: 'wm4', workspaceId: 'ws1', user: mockUsers[3], role: 'MEMBER', joinedAt: '2024-12-01T09:00:00Z' },
  { id: 'wm5', workspaceId: 'ws1', user: mockUsers[4], role: 'VIEWER', joinedAt: '2025-01-10T09:00:00Z' },
];

export const mockAutomationRules = [
  { id: 'ar1', workspaceId: 'ws1', name: 'Alert on BLOCKED', trigger: 'ISSUE_STATUS_CHANGED', conditionField: 'status', conditionOperator: 'equals', conditionValue: 'BLOCKED', actionType: 'SEND_NOTIFICATION', actionTarget: 'workspace_admins', enabled: true,  createdAt: '2025-01-15T09:00:00Z' },
  { id: 'ar2', workspaceId: 'ws1', name: 'Urgent priority alert', trigger: 'PRIORITY_CHANGED', conditionField: 'priority', conditionOperator: 'equals', conditionValue: 'URGENT', actionType: 'SEND_EMAIL', actionTarget: 'project_lead', enabled: true,  createdAt: '2025-01-20T10:00:00Z' },
  { id: 'ar3', workspaceId: 'ws1', name: 'Due tomorrow reminder', trigger: 'DUE_DATE_NEAR', conditionField: 'due_in_days', conditionOperator: 'equals', conditionValue: '1', actionType: 'SEND_NOTIFICATION', actionTarget: 'assignee', enabled: true,  createdAt: '2025-01-22T09:00:00Z' },
  { id: 'ar4', workspaceId: 'ws1', name: 'Webhook on DONE', trigger: 'ISSUE_STATUS_CHANGED', conditionField: 'status', conditionOperator: 'equals', conditionValue: 'DONE', actionType: 'TRIGGER_WEBHOOK', actionTarget: 'wh1', enabled: false, createdAt: '2025-02-01T11:00:00Z' },
];

export const mockWebhooks = [
  { id: 'wh1', workspaceId: 'ws1', name: 'Slack integration', url: 'https://hooks.slack.com/services/T00/B00/XXXX', secret: 'whsec_xxx', events: ['issue.created', 'issue.status_changed', 'comment.created'], enabled: true,  lastDelivery: '2025-02-14T13:01:00Z', lastStatus: 200, createdAt: '2025-01-10T09:00:00Z' },
  { id: 'wh2', workspaceId: 'ws1', name: 'CI/CD trigger',     url: 'https://api.github.com/repos/wqmt/backend/dispatches', secret: 'whsec_yyy', events: ['issue.status_changed'], enabled: false, lastDelivery: '2025-02-10T10:00:00Z', lastStatus: 422, createdAt: '2025-01-15T10:00:00Z' },
];

export const mockDeliveries = [
  { id: 'd1', webhookId: 'wh1', event: 'issue.status_changed', status: 'success', responseCode: 200, attempts: 1, lastAttemptAt: '2025-02-14T13:01:00Z' },
  { id: 'd2', webhookId: 'wh1', event: 'issue.created',        status: 'success', responseCode: 200, attempts: 1, lastAttemptAt: '2025-02-13T10:05:00Z' },
  { id: 'd3', webhookId: 'wh1', event: 'comment.created',      status: 'failed',  responseCode: 500, attempts: 3, lastAttemptAt: '2025-02-12T09:00:00Z' },
];

export const mockAnalytics = {
  issuesByStatus: [
    { name: 'Backlog',     value: 2 },
    { name: 'Todo',        value: 3 },
    { name: 'In Progress', value: 3 },
    { name: 'In Review',   value: 1 },
    { name: 'Blocked',     value: 1 },
    { name: 'Done',        value: 3 },
  ],
  issuesByPriority: [
    { name: 'Low',    value: 2 },
    { name: 'Medium', value: 4 },
    { name: 'High',   value: 5 },
    { name: 'Urgent', value: 2 },
  ],
  weeklyCompleted: [
    { week: 'Jan W1', completed: 1 },
    { week: 'Jan W2', completed: 2 },
    { week: 'Jan W3', completed: 1 },
    { week: 'Jan W4', completed: 3 },
    { week: 'Feb W1', completed: 2 },
    { week: 'Feb W2', completed: 4 },
  ],
  memberWorkload: [
    { name: 'Harithik', assigned: 4, completed: 3 },
    { name: 'Rohan',    assigned: 3, completed: 2 },
    { name: 'Priya',    assigned: 2, completed: 1 },
    { name: 'Arjun',    assigned: 2, completed: 1 },
    { name: 'Kavya',    assigned: 1, completed: 0 },
  ],
  overdueByProject: [
    { project: 'Backend API',      overdue: 2 },
    { project: 'Sensor Integ.',    overdue: 1 },
    { project: 'React Dashboard',  overdue: 0 },
    { project: 'ML Risk Model',    overdue: 1 },
  ],
  metrics: {
    completionRate: 42,
    avgCompletionDays: 6.2,
    blockedCount: 1,
    overdueCount: 3,
    mostActiveMember: 'Harithik Reddy',
  },
};
