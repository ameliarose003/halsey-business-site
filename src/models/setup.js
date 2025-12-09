import db from './db.js';
import setupUsersDatabaseTables from './users-db-setup.js';

const createPodcastTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS podcasts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(250) NOT NULL,
        url VARCHAR(150) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

/**
 * Creates a URL-friendly slug from one or more strings by converting to lowercase,
 * replacing spaces with hyphens, and removing special characters.
 *
 * @param {...string} strings - One or more strings to convert into a slug
 * @returns {string} A URL-friendly slug with only lowercase letters, numbers, and hyphens
 */
const createSlug = (...strings) => {
    return strings
        .filter((str) => {
            return str && typeof str === 'string';
        })
        .join(' ')
        .toLowerCase()
         // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove special characters except hyphens
        .replace(/[^a-z0-9\-]/g, '')
        // Replace multiple consecutive hyphens with single hyphen
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-|-$/g, '');
};

// const insertPodcast = async(podcast, verbose = true) => {
//     const slug = createSlug(podcast.title);

//     const query = `
//         INSERT INTO podcasts (id, title, description, video)
//         VALUES ($1, $2, $3, $4, $5)
//     `
// };

const allTablesExist = async() => {
    const tables = ['podcasts'];
    const res = await db.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ANY($1)        
        `,
        [tables]
    );
    return res.rowCount === tables.length;
};

const lastSeedRowsExist = async() => {
    return true;
};

const isAlreadyInitialized = async(verbose = true) => {
    if (verbose) {
        console.log('Checking existing schema & seed...');
    }

    const tablesOk = await allTablesExist();
    if (!tablesOk) {
        return false;
    }

    const rowsOk = await lastSeedRowsExist();
    return rowsOk;
};

// set up database
const setupDatabase = async() => {
    const verbose = process.env.ENABLE_SQL_LOGGING === 'true';
    try {
        if (await isAlreadyInitialized(verbose)) {
            setupUsersDatabaseTables(verbose);
            if (verbose) console.log('DB already initialized - skipping setup.');
            return true;
        }

        if (verbose) console.log('Setting up database...');

        await db.query(createPodcastTableIfNotExists);

        if (verbose) {
            setupUsersDatabaseTables(verbose);
            console.log('Database setup complete');
        }
        return true;
    } catch (error) {
        console.error('Error setting up database:', error.message);
        throw error;
    };
};

// test database connection
const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time')
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { createSlug, setupDatabase, testConnection };