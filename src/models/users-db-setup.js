import db from './db.js';
import { hashPassword} from './forms/registration.js';

// SQL to create roles table
const createRolesTableIfNotExist = `
    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL,
        role_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// SQL to add role_id column to users table if it doesn't exist
const addRoleIdToUsersIfNotExists = `
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'role_id'
        ) THEN
            ALTER TABLE users
            ADD COLUMN role_id INTEGER REFERENCES roles(id);
        END IF;
    END $$;
`;

// Create the roles table
const createRolesTable = async (verbose = true) => {
    try {
        await db.query(createRolesTableIfNotExist);
        if (verbose) {
            console.log ('roles table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify roles table:', error);
        }
    }
};

// Add role_id column to users table
const addRoleIdColumnToUsers = async (verbose = true) => {
    try {
        await db.query(addRoleIdToUsersIfNotExists);
        if (verbose) {
            console.log('role_id column added to users table/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to add role_id column to users:', error)
        }
    }
};

const seedRolesAndUsers = async (verbose = true) => {
    try {
        // check if roles exist
        const roleCheck = await db.query('SELECT COUNT(*) FROM roles');
        const roleCount = parseInt(roleCheck.rows[0].count);

        if (roleCount === 0) {
            // no roles exist, insert them
            await db.query(`
                INSERT INTO roles (role_name, role_description) VALUES
                ('user', 'Standard user with basic access'),
                ('admin', 'Administrator with full system access')
            ]`);
            if (verbose) {
                console.log('Roles seeded: user and admin');
            }
        }

        // Get role IDs for seeding users
        const userRolesResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'user'"
        );
        const adminRoleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'admin'"
        );

        const userRoleId = userRolesResult.rows[0].id;
        const adminRoleId = adminRoleResult.rows[0].id;

        // Update any existing users without a role_id to default user role
        const updateResult = await db.query(`
            UPDATE users
            SET role_id = $1
            WHERE role_id IS NULL
        `, [userRoleId]);

        if (verbose && updateResult.rowCound > 0) {
            console.log(`Updated ${updatedResult.rowCount} existing user(s) to default role`);
        }

        // Check if admin user exists
        const adminCheck = await db.query(
            'SELECT COUNT(*) FROM users WHERE role_id = $1',
            [adminRoleId]
        );
        const adminCount = parseInt(adminCheck.rows[0].count);

        // Can delete this code afterwards. Setting it up to ensure we aren't locked out of the admin role during development
        if (adminCount === 0) {
            // No admin exists, create one
            const hashedPassword = await hashPassword('Test1234!');
            await db.query(`
                INSERT INTO users (name, email, password, role_id)
                VALUES($1, $2, $3, $4)
            `, ['Test Admin', 'admin@example.com', hashedPassword, adminRoleId]);
            if (verbose) {
                console.log('Admin user created: admin@example.com / Test1234!');
            }
        }

        const userCheck = await db.query(
            'SELECT COUNT (*) FROM users WHERE role_id = $1',
            [userRoleId]
        );
        const userCount = parseInt(userCheck.rows[0].count);
    } catch (error) {
        if (verbose) {
            console.error('Failed to seed roles and users:', error);
        }
    }
};

const createContactTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS contact_form (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(225) NOT NULL,
        message TEXT NOT NULL,
        submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Execute the SQL to create a contact_form table 
const insertContactForm = async (verbose = true) => {
    try {
        await db.query(createContactTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};

// SQL to create a users table for registration system
const createUsersTableIfNotExists = `
    CREATE TABLE IF  NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(225) NOT NULL,
        email VARCHAR(225) UNIQUE NOT NULL,
        password VARCHAR(225) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Execute the SQL to create users table
const insertUsersTable = async (verbose = true ) => {
    try {
        await db.query(createUsersTableIfNotExists);
        if (verbose) {
            console.log('Users table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify users table:', error);
        }
    }
};

// Calls/runs SQL against the project database for setup
const setupUsersDatabaseTables = async (verbose = true) => {
    await insertContactForm(verbose);
    await createRolesTable(verbose);
    await insertUsersTable(verbose);
    await addRoleIdColumnToUsers(verbose);
    await seedRolesAndUsers(verbose);
};

export default setupUsersDatabaseTables;