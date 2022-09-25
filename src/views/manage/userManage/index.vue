<template>
  <div style="background: #ececec; padding: 30px">
    <a-card title="Card title" :bordered="false" style="">
      <a-table :columns="columnTitle" :data-source="data">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
          </template>
          <template v-else-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>

</template>
<script lang="ts">
import {DownOutlined, SmileOutlined} from '@ant-design/icons-vue';
import {defineComponent, onMounted, ref} from 'vue';

import column from "/@/views/manage/userManage/column";
import myAxios from "/@/utils/http/anxiosOrigin/MyAxios";

const data = ref([]);
// {
//   id:'1',
//     username:'小王',
//   userAccount:'wanghaotian',
//   avatarUrl:'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
//   gender:'0',
//   phone:'18151607685',
//   email:'16376416033@qq.com',
//   userStatus:'0',
//   createTime:'',
//   updateTime:'',
//   userRole:'0',
// }


export default defineComponent({
  components: {
    SmileOutlined,
    DownOutlined,
  },
  setup() {
    onMounted(async ()=>{
      const result = await myAxios.get("/api/user/cfl/list");
      data.value = result.data.list
      alert(JSON.stringify(data.value))
      console.log(data.value)
    })
    const columnTitle =  ref(column);
    return {
      data,
      columnTitle,
    };
  },
});
</script>
