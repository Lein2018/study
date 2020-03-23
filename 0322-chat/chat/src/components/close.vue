<template>
	<div class="close">
		<span></span>
		<span></span>
	</div>
</template>

<script>
</script>

<style>
	.close {
		width: 44px;
		height: 32px;
		float: right;
		position: relative;
		cursor: pointer;
	}
	.close:hover {
		background: #f45454;
	}
	.close:hover span {
		background: #fff;
	}
	.close span {
		width: 12px;
		height: 1px;
		background: #5f5f5f;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%) rotate(45deg);
		-webkit-transform: translate(-50%,-50%) rotate(45deg);
	}
	.close span:nth-child(1) {
		transform: translate(-50%,-50%) rotate(-45deg);
		-webkit-transform: translate(-50%,-50%) rotate(-45deg);
	}
</style>