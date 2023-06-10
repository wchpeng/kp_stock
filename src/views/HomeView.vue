<template>
  <Row class="nav">
    <Col span="4">
      <Image :src="logo" fit="contain" width="100%" height="46px" />
    </Col>
    <Col span="3">
      <Dropdown @on-click="selectMenuItem" style="line-height: 46px" transfer>
        <a href="javascript:void(0)">
            功能选择
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <template #list>
            <DropdownMenu>
                <!-- <DropdownItem name="self">自选</DropdownItem> -->
                <DropdownItem name="slist">列表</DropdownItem>
            </DropdownMenu>
        </template>
      </Dropdown>
    </Col>
    <Col span="4" offset="12">
      <Space>
      <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" shape="circle" />
      {{ nickname }}
    </Space>
    </Col>
  </Row>
  <div style="height:50px"></div>
  <router-view />
</template>

<script setup>
import logo from "@/assets/logo.png"
import { Space } from "view-ui-plus";
import { useRouter } from 'vue-router'
import store from "@/store"

const nickname = store.state.nickname
const router = useRouter()

function selectMenuItem(name) {
  if (name == 'self'){
    router.push({'path': '/self'})
  } else {
    router.push({'path': '/stocklist'})
  }
}
</script>


<style scoped>
.nav{
  height: 50px;
  width: 100%;
  padding: 2px 0;
  position: fixed;
  background-color: #fff;
  text-align: center;
}
.menu{
  margin-top: 50px;
  height: calc(100vh - 50px);
  background-color: #fff;
}
.ivu-select-dropdown{
  z-index: 100;
}
</style>