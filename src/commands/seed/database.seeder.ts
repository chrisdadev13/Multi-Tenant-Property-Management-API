import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
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

  const permissions = await connection.collection('permissions').insertMany([
    {
      resource: 'users',
      action: 'create',
      description: 'Can create users',
      uniqueKey: 'users:create',
    },
    {
      resource: 'users',
      action: 'read',
      description: 'Can read users',
      uniqueKey: 'users:read',
    },
    {
      resource: 'properties',
      action: 'manage',
      description: 'Can manage properties',
      uniqueKey: 'properties:manage',
    },
    {
      resource: 'tenancies',
      action: 'manage',
      description: 'Can manage tenancies',
      uniqueKey: 'tenancies:manage',
    },
  ]);

  // 2. Create initial admin user (without tenant and role)
  const adminUser = await connection.collection('users').insertOne({
    name: 'System Admin',
    email: 'admin@example.com',
    password: await hashPassword('admin123'),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 3. Create Tenant
  const tenant = await connection.collection('tenants').insertOne({
    name: 'Sample Property Management',
    contactEmail: 'contact@sample.com',
    contactPhone: '123-456-7890',
    owner: adminUser.insertedId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 4. Create Roles
  const roles = await connection.collection('roles').insertMany([
    {
      name: 'Admin',
      tenant: tenant.insertedId,
      permissions: Object.values(permissions.insertedIds),
      description: 'Full system access',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Property Manager',
      tenant: tenant.insertedId,
      permissions: [permissions.insertedIds[2], permissions.insertedIds[3]], // properties and tenancies manage
      description: 'Can manage properties and tenancies',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 5. Update admin user with tenant and role
  await connection.collection('users').updateOne(
    { _id: adminUser.insertedId },
    {
      $set: {
        tenant: tenant.insertedId,
        role: roles.insertedIds[0], // Admin role
      },
    },
  );

  // 6. Create additional users
  const users = await connection.collection('users').insertMany([
    {
      name: 'Property Manager',
      email: 'manager@example.com',
      password: await hashPassword('manager123'),
      tenant: tenant.insertedId,
      role: roles.insertedIds[1], // Property Manager role
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'John Tenant',
      email: 'tenant@example.com',
      password: await hashPassword('tenant123'),
      tenant: tenant.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 7. Create Properties
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

  // 8. Create Tenancies
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

  // 9. Create Jobs
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
