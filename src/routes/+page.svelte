<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

  export let data: PageData;

  let edit: number | null = null;
</script>

<main>
  <div class="container">
    <h1>Welcome to SvelteKit for Cloudflare Pages</h1>
    {#if data.todos}
      <h2>Todos</h2>
      <p>These todo items are persisted in a D1 database</p>
      <ul class="todo-list">
        {#each data.todos as todo (todo.id)}
          <li class="todo-item">
            <form method="POST" action="?/updateTodo" use:enhance on:submit={() => edit = null}>
              <input type="hidden" name="id" value="{todo.id}">
              {#if edit === todo.id}
                <input class="todo-title" type="text" name="title" value="{todo.title}" required>
                <button type="button" on:click={() => edit = null}>Cancel</button>
                <button type="submit">Save</button>
              {:else}
                <span class="todo-title" class:completed={todo.completed}>{todo.title}</span>
                <button type="button" on:click={() => edit = todo.id}>Edit</button>
                {#if todo.completed}
                  <button type="submit" name="completed" value="false">Not Done</button>
                {:else}
                  <button type="submit" name="completed" value="true">Done</button>
                {/if}
              {/if}
            </form>
          </li>
        {/each}
        <li class="todo-item">
          <form method="POST" action="?/createTodo" use:enhance>
            <input class="todo-title" type="text" name="title" required>
            <button type="submit">Add</button>
          </form>
        </li>
      </ul>

      <h2>Random Image</h2>
      <p>This is a random image stored in an R2 Bucket</p>
      <img class="random-image" src="/random-image" alt="Random">
    {:else}
      <h2>Not Initialized!</h2>
      <p>
        Click on the "Initialize" button to create a KV store, D1 database, and R2 bucket within a local dev environment.
        You can find the created items in the <code>.data</code> directory.
      </p>
      <form method="POST" action="?/initialize" use:enhance>
        <button type="submit">Initialize</button>
      </form>
    {/if}
  </div>
</main>

<style lang="scss">
  .container {
    max-width: 50rem;
    margin: 0 auto;
  }

  .todo-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 40rem;
  }

  .todo-item {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    justify-content: space-between;
  }

  .todo-title {
    flex: 1;
    text-align: left;
    font-style: sans-serif;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    
    &:is(button) {
      border: none;
      background: none;
    }

    &.completed {
      text-decoration: line-through;
    }
  }

  .random-image {
    width: 25rem;
    height: auto;
  }

  form {
    display: contents;
  }
</style>