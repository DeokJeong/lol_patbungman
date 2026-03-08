<template>
  <div class="layout-wrapper">
    <main class="main-content">
      <slot />
    </main>
    
    <footer>
      <p>&copy; 2025 My Nuxt App</p>
    </footer>
  </div>
</template>

<style scoped>
.layout-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; }
</style>