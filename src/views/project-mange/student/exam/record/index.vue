<template>
  <div style="margin-top: 10px" class="app-contain">
    <el-row :gutter="50">
      <el-col :span="18">
        <el-table v-loading="listLoading" :data="tableData" fit highlight-current-row style="width: 100%" @row-click="itemSelect">
          <el-table-column prop="id" label="序号" width="100px" />
          <el-table-column prop="paperName" label="名称" />
          <el-table-column prop="subjectName" label="学科" width="100" />
          <el-table-column prop="createTime" label="做题时间" width="170" />
          <el-table-column align="right" width="70">
            <template slot-scope="{row}">
              <router-link v-if="row.status === 1 " :to="{path:'/edit',query:{id:row.id}}">
                <el-button type="text" size="small">批改</el-button>
              </router-link>
              <router-link v-if="row.status === 2 " :to="{path:'/project-mange/read-exam-paper',query:{id:row.id}}">
                <el-button type="text" size="small">查看试卷</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :background="false"
          :page.sync="queryParam.pageIndex"
          :limit.sync="queryParam.pageSize"
          style="margin-top: 20px"
          @pagination="search"
        />
      </el-col>
      <el-col :span="6">
        <el-card class="record-answer-info">
          <el-form label-width="50%">
            <el-form-item label="系统判分：">
              <span>{{ selectItem.systemScore }}</span>
            </el-form-item>
            <el-form-item label="最终得分：">
              <span>{{ selectItem.userScore }}</span>
            </el-form-item>
            <el-form-item label="试卷总分：">
              <span>{{ selectItem.paperScore }}</span>
            </el-form-item>
            <el-form-item label="正确题数：">
              <span>{{ selectItem.questionCorrect }}</span>
            </el-form-item>
            <el-form-item label="总题数：">
              <span>{{ selectItem.questionCount }}</span>
            </el-form-item>
            <el-form-item label="用时：">
              <span>{{ selectItem.doTime }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList } from '@/api/project-mange/exam-paper-answer'
import store from '@/store'

export default {
  components: { Pagination },
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: false,
      tableData: [],
      total: 0,
      selectItem: {
        systemScore: '0',
        userScore: '0',
        doTime: '0',
        paperScore: '0',
        questionCorrect: 0,
        questionCount: 0
      }
    }
  },
  created() {
    this.search()
    this.levelEnumMap = store.state.enumItem.user.levelEnum

    scrollTo(0, 800)
  },
  methods: {
    search() {
      this.listLoading = true
      fetchList(this.queryParam).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    itemSelect(row, column, event) {
      this.selectItem = row
    },
    handleRead(row) {
      this.$router.push({ path: '/project-mange/read-exam-paper', query: { id: row.id }})
    }

    // statusTagFormatter(status) {
    //   return this.enumFormat(this.statusTag, status)
    // },
    // statusTextFormatter(status) {
    //   return this.enumFormat(this.statusEnum, status)
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
