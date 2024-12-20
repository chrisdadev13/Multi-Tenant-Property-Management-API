export const Resources = {
  PROPERTIES: 'properties',
  JOBS: 'jobs',
  USERS: 'users',
  TENANCIES: 'tenancies',
} as const;

export type Resource = (typeof Resources)[keyof typeof Resources];

export const Actions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  ASSIGN: 'assign',
} as const;

export type Action = (typeof Actions)[keyof typeof Actions];

export interface RoleTemplate {
  name: string;
  description: string;
  permissionRules: Array<{
    resource: Resource;
    actions: Action[];
  }>;
}

export const RoleTemplates: Record<string, RoleTemplate> = {
  ADMIN: {
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissionRules: [
      {
        resource: Resources.PROPERTIES,
        actions: [Actions.CREATE, Actions.READ, Actions.UPDATE, Actions.DELETE],
      },
      {
        resource: Resources.JOBS,
        actions: [
          Actions.CREATE,
          Actions.READ,
          Actions.UPDATE,
          Actions.DELETE,
          Actions.ASSIGN,
        ],
      },
      {
        resource: Resources.USERS,
        actions: [Actions.CREATE, Actions.READ, Actions.UPDATE, Actions.DELETE],
      },
      {
        resource: Resources.TENANCIES,
        actions: [Actions.CREATE, Actions.READ, Actions.UPDATE, Actions.DELETE],
      },
    ],
  },
  PROPERTY_MANAGER: {
    name: 'Property Manager',
    description: 'Can manage properties and handle maintenance jobs',
    permissionRules: [
      {
        resource: Resources.PROPERTIES,
        actions: [Actions.READ, Actions.UPDATE],
      },
      {
        resource: Resources.JOBS,
        actions: [Actions.CREATE, Actions.READ, Actions.UPDATE, Actions.ASSIGN],
      },
      {
        resource: Resources.TENANCIES,
        actions: [Actions.READ, Actions.UPDATE],
      },
    ],
  },
  USER: {
    name: 'User',
    description: 'Regular user with basic access',
    permissionRules: [
      {
        resource: Resources.PROPERTIES,
        actions: [Actions.READ],
      },
      {
        resource: Resources.JOBS,
        actions: [Actions.READ, Actions.CREATE],
      },
      {
        resource: Resources.TENANCIES,
        actions: [Actions.READ],
      },
    ],
  },
};
