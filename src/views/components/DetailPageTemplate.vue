<template>
  <div class="detail-page__container">
    <el-scrollbar style="height: 100%">
      <div class="detail-page__content">
        <div class="detail-page__header">
          <slot name="header"></slot>
        </div>
        <div class="detail-page__body">
          <slot name="body"></slot>
        </div>
        <div class="detail-page__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "DetailPageTemplate"
};
</script>