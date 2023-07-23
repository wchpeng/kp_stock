<template>
  <Row>
    <Col span="18" offset="3">
      <Form :model="formItem" :label-width="120" class="form">
        <FormItem label="股票代码/名字">
          <Input v-model="formItem.k" placeholder="如：600519" clearable style="width: 350px" />
        </FormItem>
        <FormItem label="自定义规则">
          <Select v-model="formItem.rule" style="width:350px">
            <Option v-for="item in ruleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="名字">
          <Input v-model="formItem.name" placeholder="如：茅台" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="日期">
          <DatePicker type="daterange" v-model="formItem.date_range" split-panels placeholder="" style="width: 200px;"></DatePicker>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="getStockList">搜索</Button>
          <Button style="margin-left: 8px" @click="formItem.k=''">清空</Button>
          <Button style="margin-left: 8px" shape="circle" icon="md-add" @click="show_modal=true"></Button>
        </FormItem>
      </Form>
      <div style="background-color: #fff;border-radius: 5px; overflow:hidden">
        <Table :loading="loading" :columns="columns" :data="data">
          <template #ts_code="{row}">
            <router-link :to="'/stock-detail/' + row.ts_code">{{ row.ts_code }}</router-link>
          </template>
          <template #selfc="{ row, index }">
            <Poptip
              confirm
              transfer
              title="确认删除？"
              @on-ok="delete_ok(row.ts_code)"
              @on-cancel="delete_cancel">
                <Button shape="circle" icon="ios-trash" size="small"></Button>
            </Poptip>
            <Button style="margin-left: 5px;" shape="circle" icon="md-add" size="small" v-show="!row.is_selected" @click="click_add2self(row)"></Button>
            <Button style="margin-left: 5px;" type="success" shape="circle" icon="md-checkmark" size="small" v-show="row.is_selected" @click="click_del2self(row)"></Button>
          </template>
        </Table>
        <Page  :total="total" :page-size="pageSize" v-model="pageNo" @on-change="changePageNo" style="padding:24px 0; text-align: center;" />
      </div>
    </Col>
  </Row>
  <Modal
    v-model="show_modal"
    title="录入"
    @on-ok="modal_ok"
    @on-cancel="modal_cancel">
    <Form :model="modal_form" :label-width="100" class="form">
      <FormItem label="代码">
        <Input v-model.trim="modal_form.ts_code" placeholder="如：600519" clearable style="width: 200px" />
      </FormItem>
      <FormItem label="名字">
        <Input v-model.trim="modal_form.name" placeholder="如：茅台" clearable style="width: 200px" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup>
import { Message } from 'view-ui-plus'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted, watch } from 'vue'
import { api_stock_list,api_stock_add, api_stock_del, api_selected_mod } from '@/api/index'

const show_modal = ref(false)
const modal_form = reactive({
  ts_code: '',
  name: ''
})
const router = useRouter()
async function modal_ok(){
  if (!modal_form.ts_code || !modal_form.name){
    Message.warning('填写不规范')
    return
  }
  let response = await api_stock_add({ts_code: modal_form.ts_code, name: modal_form.name})
  if (response.code !== 0){
    Message.warning(response.msg)
  } else {
    formItem.k = ''
    await getStockList()
  }
  show_modal.value = false
}
function modal_cancel(){
  modal_form.ts_code = ''
  modal_form.name = ''
}
async function delete_ok(ts_code){
  await api_stock_del({'ts_code': ts_code})
  await getStockList()
}
function delete_cancel(){}
const formItem = reactive({
  k: '',
  rule: '0'
})
const ruleList = [
  {label: '------', value: '0'},
  {label: '流通市值300亿内昨日交易金额大于流通市值5%', value: '1'}
]
const loading = ref(false)
const columns = reactive([
  {title: '股票代码', slot: 'ts_code'},
  {title: '名字', key: 'name'},
  {title: '开盘', key: 'open'},
  {title: '收盘', key: 'close'},
  // {title: '最高', key: 'high'},
  // {title: '最低', key: 'low'},
  // {title: '成交量', key: 'vol'},
  {title: '交易额', key: 'amount'},
  {title: '量比', key: 'volume_ratio'},
  {title: '换手率', key: 'turnover_rate'},
  {title: '流通市值', key: 'circ_mv'},
  {title: '操作', slot: 'selfc', align: 'center'},
])
// const data = reactive({'values': []})
const data = reactive([])
const total = ref(60)
const pageSize = ref(10)
const pageNo = ref(1)
watch(
  () => formItem.k,
  (keyword) => {
    pageNo.value = 1
  }
)
watch(
  () => formItem.rule,
  (keyword) => {
    pageNo.value = 1
    getStockList()
  }
)
async function getStockList(){
  loading.value = true
  let params = {
    page_no: pageNo.value,
    page_size: pageSize.value,
    k: formItem.k,
    rule: formItem.rule
  }
  let response = await api_stock_list(params)
  if (response.code != 0){
    loading.value = false
    Message.warning(response.msg)
    // router.push({path: '/login'})
  } else {
    data.splice(0, data.length)
    for (let i=0; i<response.data.list.length; i++){
      data.push(response.data.list[i])
    }
    // data.values = response.data.list
    total.value = response.data.total
  }
  loading.value = false
}
async function changePageNo(){
  await getStockList()
}
async function click_add2self(row){
  let response = await api_selected_mod([row.ts_code], [])
  if(response.code == 0){
    row.is_selected = true
  }
}
async function click_del2self(row){
  let response = await api_selected_mod([], [row.ts_code])
  if(response.code == 0){
    row.is_selected = false
  }
}
onMounted(async () => {
  await getStockList()
})
</script>

<style scoped>
.form{
  background-color: #fff;
  border-radius: 5px;
  padding: 24px 0;
  margin: 20px 0;
}
</style>