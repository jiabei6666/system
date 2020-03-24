<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{listname1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{listname2}}</el-breadcrumb-item>
      </el-breadcrumb>
</template>

<script>
    export default {
        props:['listname1','listname2']
    }
</script>

<style>
    
</style>