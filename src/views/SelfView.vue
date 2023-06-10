<template>
  <Row>
    <Col span="18" offset="3">
      <Form :model="formItem" :label-width="80" inline class="form">
        <FormItem label="股票代码">
          <Input v-model="formItem.ts_code" placeholder="如：600519" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="名字">
          <Input v-model="formItem.name" placeholder="如：茅台" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="日期">
          <DatePicker type="daterange" v-model="formItem.date_range" split-panels placeholder="" style="width: 200px;"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary">搜索</Button>
          <Button style="margin-left: 8px">清空</Button>
        </FormItem>
      </Form>
      <div style="background-color: #fff;border-radius: 5px; overflow:hidden">
        <Table :loading="loading" :columns="columns" :data="data">
          <template #ts_code="{row}">
            <router-link :to="'/stock-detail/' + row.ts_code">{{ row.ts_code }}</router-link>
          </template>
          <template #selfc="{ row, index }">
            <Button shape="circle" icon="md-add" size="small" v-show="!row.is_self" @click="click_add2self(row)"></Button>
            <Button type="success" shape="circle" icon="md-checkmark" size="small" v-show="row.is_self" @click="click_del2self(row)"></Button>
          </template>
        </Table>
        <Page  :total="total" :page-size="pageSize" v-model="pageNo" style="padding:24px 0; text-align: center;" />
      </div>
    </Col>
  </Row>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formItem = reactive({
  name: '',
  ts_code: '',
  date_range: []
})
const loading = ref(false)
const columns = reactive([
  {title: '股票代码', slot: 'ts_code'},
  {title: '名字', key: 'symbol'},
  {title: '开盘', key: 'open'},
  {title: '收盘', key: 'close'},
  {title: '最高', key: 'high'},
  {title: '最低', key: 'low'},
  {title: '成交量', key: 'vol'},
  {title: '成交额', key: 'amount'},
  {title: '自选', slot: 'selfc', align: 'center'},
])
const data = reactive([
  {ts_code: 'TS39940', symbol: '深海国际', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
  {ts_code: 'TS39941', symbol: '深海国际2', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
  {ts_code: 'TS39942', symbol: '深海国际3', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
  {ts_code: 'TS39943', symbol: '深海国际4', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: true},
  {ts_code: 'TS39944', symbol: '深海国际5', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
  {ts_code: 'TS39945', symbol: '深海国际6', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: true},
  {ts_code: 'TS39946', symbol: '深海国际7', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
  {ts_code: 'TS39947', symbol: '深海国际8', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
  {ts_code: 'TS39948', symbol: '深海国际9', open: 10.53, close: 11.30, high: 11.35, low: 10.35, vol: 50000, amount: 14638, is_self: false},
])
function click_add2self(row){
  row.is_self = true
  console.log(row)
}
function click_del2self(row){
  row.is_self = false
  console.log(row)
}

const total = ref(60)
const pageSize = ref(20)
const pageNo = ref(1)
</script>

<style scoped>
.form{
  background-color: #fff;
  border-radius: 5px;
  padding: 24px 0 0 0;
  margin: 20px 0;
}
</style>