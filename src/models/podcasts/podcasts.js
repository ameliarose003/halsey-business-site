import db from '../db.js';
import { createSlug } from '../setup.js';

const titleExists = async (title) => {
    try {
        const query = 'SELECT COUNT(*) FROM podcasts WHERE title = $1';
        const result = await db.query(query, [title]);

        const titleCount = parseInt(result.rows[0].count);
        return titleCount > 0;
    } catch (error) {
        console.error('DB Error in titleExists:', error);
        return false;
    }
};

const savePodcast = async (title, description, url) => {
    try {

        const slug = createSlug(title);

        const query = `
            INSERT INTO podcasts (title, description, url, slug)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, description, url, slug, created_at, updated_at
        `;

        const result = await db.query(query, [title, description, url, slug]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in savePodcast:', error);
        return null;
    }

};

const getAllPodcasts = async () => {
    try {
        const query = `
            SELECT id, title, description, url, created_at, updated_at
            FROM podcasts
            ORDER BY created_at DESC
        `;

        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('DB Error in getAllPodcasts:', error);
        return [];
    }
};

const getPodcastById = async (id) => {
    try {
        const query = `
            SELECT
                podcasts.id,
                podcasts.title,
                podcasts.description,
                podcasts.url,
                podcasts.created_at,
                podcasts.updated_at
        `;

        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in getPodcastById:', error);
        return null;
    }
};

const updatePodcast = async (id, title, description, url) => {
    try {
        const query = `
            UPDATE podcasts
            SET title = $1,
            description = $2,
            url = $3,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, title, description, url, updated_at
        `;

        const result = await db.query(query, [title, description, url, id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in updatePodcast:', error);
        return null;
    }
};

const deletePodcast = async (id) => {
    try {
        const query = 'DELETE FROM podcasts WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('DB Error in deletePodcast:', error);
        return false;
    }
};

export { titleExists, savePodcast, getAllPodcasts, getPodcastById, updatePodcast, deletePodcast};