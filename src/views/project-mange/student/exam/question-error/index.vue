<template>
  <div style="margin-top: 10px" class="app-contain">
    <el-row :gutter="50">
      <el-col :span="14">
        <el-table v-loading="listLoading" :data="tableData" fit highlight-current-row style="width: 100%" @row-click="itemSelect">
          <el-table-column prop="shortTitle" label="题干" show-overflow-tooltip />
          <el-table-column prop="questionType" label="题型" :formatter="questionTypeFormatter" width="70" />
          <el-table-column prop="subjectName" label="学科" width="80" />
          <el-table-column prop="createTime" label="做题时间" width="170" />
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
      <el-col :span="10">
        <el-card class="record-answer-info">
          <el-form>
            <el-form-item>
              <QuestionAnswerShow :q-type="selectItem.questionType" :q-loading="qAnswerLoading" :question="selectItem.questionItem" :answer="selectItem.answerItem" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import QuestionAnswerShow from '../components/QuestionAnswerShow'
import { fetchList, fetchDetail } from '@/api/project-mange/t-exam-paper-question-customer-answer'
import store from '@/store'

export default {
  components: { Pagination, QuestionAnswerShow },
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: false,
      tableData: [],
      total: 0,
      qAnswerLoading: false,
      selectItem: {
        questionType: 0,
        questionItem: null,
        answerItem: null
      }
    }
  },
  created() {
    this.search()
    this.questionTypeEnumMap = store.state.enumItem.exam.question.typeEnum
  },
  methods: {
    search() {
      fetchList(this.queryParam).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        if (res.data.records.length !== 0) {
          this.qAnswerShow(res.data.records[0].id)
        }
      })
    },
    itemSelect(row, column, event) {
      this.qAnswerShow(row.id)
    },
    qAnswerShow(id) {
      const _this = this
      this.qAnswerLoading = true
      fetchDetail(id).then(res => {
        _this.selectItem.questionType = res.data.question.questionType
        _this.selectItem.questionItem = res.data.question
        _this.selectItem.answerItem = res.data.answer
        _this.qAnswerLoading = false
      })
    },
    questionTypeFormatter(row, column, cellValue, index) {
      return this.questionTypeEnumMap.get(cellValue)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
