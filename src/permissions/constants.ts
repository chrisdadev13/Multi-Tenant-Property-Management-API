export const SYSTEM_PERMISSIONS = [
  {
    resource: 'properties',
    action: 'create',
    description: 'Can create new properties',
  },
  {
    resource: 'properties',
    action: 'read',
    description: 'Can view properties',
  },
  {
    resource: 'properties',
    action: 'update',
    description: 'Can modify property details',
  },
  {
    resource: 'properties',
    action: 'delete',
    description: 'Can remove properties',
  },
  {
    resource: 'tenancies',
    action: 'create',
    description: 'Can create new tenancies',
  },
  {
    resource: 'tenancies',
    action: 'read',
    description: 'Can view tenancies',
  },
  {
    resource: 'tenancies',
    action: 'update',
    description: 'Can modify property tenancies',
  },
  {
    resource: 'tenancies',
    action: 'delete',
    description: 'Can remove tenancies',
  },
  {
    resource: 'jobs',
    action: 'create',
    description: 'Can create maintenance jobs',
  },
  {
    resource: 'jobs',
    action: 'read',
    description: 'Can view maintenance jobs',
  },
  {
    resource: 'jobs',
    action: 'update',
    description: 'Can update job status',
  },
  {
    resource: 'jobs',
    action: 'assign',
    description: 'Can assign jobs to staff',
  },
];
