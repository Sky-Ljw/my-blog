<template>
  <div class="skeleton">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-line--short"></div>
        <div class="skeleton-line skeleton-line--long"></div>
        <div class="skeleton-line skeleton-line--medium"></div>
        <div class="skeleton-line skeleton-line--short"></div>
      </div>
    </div>
    <div v-else-if="type === 'post'" class="skeleton-post">
      <div class="skeleton-line skeleton-line--very-long"></div>
      <div class="skeleton-line skeleton-line--short"></div>
      <div class="skeleton-image skeleton-image--large"></div>
      <div v-for="i in 5" :key="i" class="skeleton-line skeleton-line--very-long"></div>
    </div>
    <div v-else-if="type === 'category'" class="skeleton-category">
      <div class="skeleton-line skeleton-line--very-long"></div>
      <div class="skeleton-card" v-for="i in 3" :key="i">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-line--short"></div>
          <div class="skeleton-line skeleton-line--long"></div>
          <div class="skeleton-line skeleton-line--medium"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    type: {
      type: String,
      default: 'card'
    }
  }
};
</script>

<style scoped>
.skeleton {
  width: 100%;
}

.skeleton-card {
  background: #f6f7f8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-image {
  width: 100%;
  height: 180px;
  background: #e9ecef;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-image--large {
  height: 240px;
  margin: 16px 0;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: #e9ecef;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-line--short {
  width: 40%;
}

.skeleton-line--medium {
  width: 70%;
}

.skeleton-line--long {
  width: 100%;
}

.skeleton-line--very-long {
  width: 100%;
  height: 16px;
  margin-bottom: 12px;
}

.skeleton-post {
  width: 100%;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-category {
  width: 100%;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>