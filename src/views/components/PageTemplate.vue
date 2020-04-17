<template>
  <div class="page-template">
		<div class="page-template__header">
			<slot name="page-header"></slot>
		</div>
		<div class="page-template__toolbar">
			<slot name="page-toolbar"></slot>
		</div>
		<div class="page-template__table">
			<slot name="page-table"></slot>
		</div>
		<div class="page-template__footer">
			<slot name="page-footer"></slot>
		</div>
	</div>
</template>