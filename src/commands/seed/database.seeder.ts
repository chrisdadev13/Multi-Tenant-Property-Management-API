import { Connection, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

const Resources = {
  PROPERTIES: 'properties',
  JOBS: 'jobs',
  USERS: 'users',
  TENANCIES: 'tenancies',
} as const;

const Actions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  ASSIGN: 'assign',
} as const;

const SYSTEM_PERMISSIONS = [
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
  {
    resource: 'users',
    action: 'create',
    description: 'Can create new users',
  },
  {
    resource: 'users',
    action: 'read',
    description: 'Can view users',
  },
  {
    resource: 'users',
    action: 'update',
    description: 'Can modify user details',
  },
  {
    resource: 'users',
    action: 'delete',
    description: 'Can delete users',
  },
];

const RoleTemplates = {
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

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function getPermissionIds(
  permissions: Record<string, Types.ObjectId>,
  resource: string,
  actions: string[],
): Types.ObjectId[] {
  return Object.entries(permissions)
    .filter(([key]) => {
      const [res, action] = key.split(':');
      return res === resource && actions.includes(action);
    })
    .map(([, id]) => id);
}

export async function seed(connection: Connection) {
  await Promise.all([
    connection.collection('permissions').deleteMany({}),
    connection.collection('roles').deleteMany({}),
    connection.collection('users').deleteMany({}),
    connection.collection('tenants').deleteMany({}),
    connection.collection('properties').deleteMany({}),
    connection.collection('tenancies').deleteMany({}),
    connection.collection('jobs').deleteMany({}),
  ]);

  const permissionsMap: Record<string, Types.ObjectId> = {};
  for (const permission of SYSTEM_PERMISSIONS) {
    const result = await connection.collection('permissions').insertOne({
      ...permission,
      uniqueKey: `${permission.resource}:${permission.action}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    permissionsMap[`${permission.resource}:${permission.action}`] =
      result.insertedId;
  }

  const adminUser = await connection.collection('users').insertOne({
    name: 'System Admin',
    email: 'admin@example.com',
    password: await hashPassword('admin123'),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const tenant = await connection.collection('tenants').insertOne({
    name: 'Sample Property Management',
    contactEmail: 'contact@sample.com',
    contactPhone: '123-456-7890',
    owner: adminUser.insertedId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const rolesMap: Record<string, Types.ObjectId> = {};
  for (const [key, template] of Object.entries(RoleTemplates)) {
    const permissionIds: Types.ObjectId[] = [];
    template.permissionRules.forEach((rule) => {
      permissionIds.push(
        ...getPermissionIds(permissionsMap, rule.resource, rule.actions),
      );
    });

    const result = await connection.collection('roles').insertOne({
      name: template.name,
      description: template.description,
      tenant: tenant.insertedId,
      permissions: permissionIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    rolesMap[key] = result.insertedId;
  }

  await connection.collection('users').updateOne(
    { _id: adminUser.insertedId },
    {
      $set: {
        tenant: tenant.insertedId,
        role: rolesMap.ADMIN,
      },
    },
  );

  const users = await connection.collection('users').insertMany([
    {
      name: 'Property Manager',
      email: 'manager@example.com',
      password: await hashPassword('manager123'),
      tenant: tenant.insertedId,
      role: rolesMap.PROPERTY_MANAGER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'John Tenant',
      email: 'tenant@example.com',
      password: await hashPassword('tenant123'),
      tenant: tenant.insertedId,
      role: rolesMap.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const properties = await connection.collection('properties').insertMany([
    {
      name: 'Sunset Apartments',
      address: {
        street: '123 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90028',
      },
      addressText: '123 Sunset Blvd, Los Angeles, CA 90028',
      tenant: tenant.insertedId,
      owner: users.insertedIds[0],
      assignedUsers: [users.insertedIds[0]],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Downtown Lofts',
      address: {
        street: '456 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90014',
      },
      addressText: '456 Main St, Los Angeles, CA 90014',
      tenant: tenant.insertedId,
      owner: users.insertedIds[0],
      assignedUsers: [users.insertedIds[0]],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await connection.collection('tenancies').insertMany([
    {
      tenant: tenant.insertedId,
      property: properties.insertedIds[0],
      user: users.insertedIds[1],
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await connection.collection('jobs').insertMany([
    {
      tenant: tenant.insertedId,
      property: properties.insertedIds[0],
      assignedUser: users.insertedIds[0],
      description: 'Monthly property inspection',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('Database seeded successfully!');
}
