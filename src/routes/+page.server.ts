import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const createTable = async (db: D1Database) => {
  await db.prepare('DROP TABLE IF EXISTS todos').run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY,
      title TEXT,
      completed BOOLEAN
    )
  `).run();
};

const createTodo = async (db: D1Database, title: string) => {
  await db.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)').bind(title, 0).run();
}

const getTodos = async (db: D1Database) => {
  const { results } =  await db.prepare('SELECT * FROM todos').all();

  return results as { id: number, title: string, completed: boolean }[];
};

const updateTodoStatus = async (db: D1Database, id: number, completed: boolean) => {
  await db.prepare('UPDATE todos SET completed = ? WHERE id = ?').bind(+completed, id).run();
};

const updateTodoTitle = async (db: D1Database, id: number, title: string) => {
  await db.prepare('UPDATE todos SET title = ? WHERE id = ?').bind(title, id).run();
}

const deleteTodo = async (db: D1Database, id: number) => {
  await db.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();
};

const fetchRandomImage = async () => {
  const res = await fetch('https://source.unsplash.com/random');
  const blob = await res.blob();
  const filetype = blob.type;
  const fileExt = ({
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  })[filetype];

  return new File([ blob ], 'random-image.' + fileExt, { type: filetype });
};

export const load = (async ({ platform }) => {
  const { KV, DB } = platform!.env;
  const initialized = await KV.get('initialized', 'json');

  if (initialized) {
    const todos = await getTodos(DB);

    return {
      todos
    };
  }
}) satisfies PageServerLoad;

export const actions = {
  initialize: async ({ platform }) => {
    const { KV, DB, BUCKET } = platform!.env;

    const file = await fetchRandomImage();
    await BUCKET.put('random-image', file);
    await createTable(DB);
    await KV.put('initialized', JSON.stringify(true));
  },
  createTodo: async ({ platform, request }) => {
    const { DB } = platform!.env;
    const formData = await request.formData();
    const title = formData.get('title') as string;

    if (!title) {
      return fail(400, { message: 'Title is required' });
    }

    await createTodo(DB, title);    
  },
  updateTodo: async ({ platform, request }) => {
    const { DB } = platform!.env;
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (formData.has('title')) {
      const title = formData.get('title') as string;
      await updateTodoTitle(DB, id, title);
    } else {
      const completed = formData.get('completed') === 'true';
      await updateTodoStatus(DB, id, completed);
    }
  },
  deleteTodo: async ({ platform, request }) => {
    const { DB } = platform!.env;
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    await deleteTodo(DB, id);
  }
} satisfies Actions;