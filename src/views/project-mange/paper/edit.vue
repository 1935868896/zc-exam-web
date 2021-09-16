<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="年级：" prop="gradeLevel" required>
        <el-select v-model="form.gradeLevel" placeholder="年级" clearable @change="levelChange">
          <el-option v-for="[k,v] in levelEnumMap" :key="k" :value="k" :label="v" />
        </el-select>
      </el-form-item>
      <el-form-item label="学科：" prop="subjectId" required>
        <el-select v-model="form.subjectId" placeholder="学科">
          <el-option v-for="item in subjectFilter" :key="item.id" :value="item.id" :label="item.name+' ( '+item.levelName+' )'" />
        </el-select>
      </el-form-item>
      <el-form-item label="试卷类型：" prop="paperType" required>
        <el-select v-model="form.paperType" placeholder="试卷类型">
          <el-option v-for="[k,v] in paperTypeEnumMap" :key="k" :value="k" :label="v" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="form.paperType===4" label="时间限制：" required>
        <el-date-picker
          v-model="form.limitDateTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="试卷名称：" prop="name" required>
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-for="(titleItem,index) in form.titleItems" :key="index" :label="'标题'+(index+1)+'：'" required>
        <el-input v-model="titleItem.name" style="width: 80%" />
        <el-button type="text" class="link-left" style="margin-left: 20px" size="mini" @click="addQuestion(titleItem)">
          添加题目
        </el-button>
        <el-button type="text" class="link-left" size="mini" @click="form.titleItems.splice(index,1)">删除</el-button>
        <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
          <el-form-item
            v-for="(questionItem,questionIndex) in titleItem.questionItems"
            :key="questionIndex"
            :label="'题目'+(questionIndex+1)+'：'"
            style="margin-bottom: 15px"
          >
            <el-row>
              <el-col :span="23">
                <QuestionShow :q-type="questionItem.questionType" :question="questionItem.questionObject" />
              </el-col>
              <el-col :span="1">
                <el-button type="text" size="mini" @click="titleItem.questionItems.splice(questionIndex,1)">删除
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>
      </el-form-item>
      <el-form-item label="建议时长：" prop="suggestTime" required>
        <el-input v-model="form.suggestTime" placeholder="分钟" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="addTitle">添加标题</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="questionPage.showDialog" width="70%">
      <el-form ref="queryForm" :model="questionPage.queryParam" :inline="true">
        <el-form-item label="ID：">
          <el-input v-model="questionPage.queryParam.id" clearable />
        </el-form-item>
        <el-form-item label="题型：">
          <el-select v-model="questionPage.queryParam.questionType" clearable>
            <el-option v-for="[k,v] in questionTypeEnumMap" :key="k" :value="k" :label="v" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryForm">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="questionPage.listLoading"
        :data="questionPage.tableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35" />
        <el-table-column
          label="ID"
          width="80"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="题型"
          width="70"
        >
          <template slot-scope="{ row }">
            <span>{{ questionTypeEnumMap.get(row.questionType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="题干" min-width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.questionObject.titleContent }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="questionPage.total>0"
        :total="questionPage.total"
        :page.sync="questionPage.queryParam.pageIndex"
        :limit.sync="questionPage.queryParam.pageSize"
        @pagination="search"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="questionPage.showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmQuestionSelect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { getList } from '@/api/project-mange/t-subject'
import { fetchQuestionList, fetchQuestionDetail } from '@/api/project-mange/t-question'
import QuestionShow from '../question/components/Show'
import { create, fetchPaperDetail } from '@/api/project-mange/t-exam-paper'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// import { create } from '@/api/project-mange/t-question'
export default {
  components: { QuestionShow, Pagination },

  data() {
    return {
      form: {
        id: null,
        level: null,
        subjectId: null,
        paperType: 1,
        limitDateTime: [],
        name: '',
        suggestTime: null,
        titleItems: []
      },
      subjectFilter: null,
      levelEnumMap: null,
      questionTypeEnumMap: null,
      paperTypeEnumMap: null,
      formLoading: false,
      rules: {
        level: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        paperType: [
          { required: true, message: '请选择试卷类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ],
        suggestTime: [
          { required: true, message: '请输入建议时长', trigger: 'blur' }
        ]
      },
      questionPage: {
        multipleSelection: [],
        showDialog: false,
        queryParam: {
          id: null,
          questionType: null,
          subjectId: 1,
          pageIndex: 1,
          pageSize: 5
        },
        listLoading: true,
        tableData: [],
        total: 0
      },
      currentTitleItem: null
    }
  },
  created() {
    this.levelEnumMap = store.state.enumItem.user.levelEnum
    this.questionTypeEnumMap = store.state.enumItem.exam.question.typeEnum
    this.paperTypeEnumMap = store.state.enumItem.exam.examPaper.paperTypeEnum
    getList().then(res => {
      this.subjectFilter = res.data
    })
    const id = this.$route.query.id
    if (id && parseInt(id) !== 0) {
      fetchPaperDetail(id).then(res => {
        this.form = res.data
        this.formLoading = false
      })
    }
  },
  methods: {

    submitForm() {
      create(this.form).then(res => {
        this.$message.success('添加成功')
        this.$store.dispatch('tagsView/delView', this.$route).then(() => {
          this.$nextTick(() => {
            this.$router.replace({
              path: '/project-mange/t-exam-paper'
            })
          })
        })
      })
    },
    addTitle() {
      this.form.titleItems.push({
        name: '',
        questionItems: []
      })
    },
    addQuestion(titleItem) {
      this.currentTitleItem = titleItem
      this.questionPage.showDialog = true
      this.search()
    },
    removeTitleItem(titleItem) {
      this.form.titleItems.remove(titleItem)
    },
    removeQuestion(titleItem, questionItem) {
      titleItem.questionItems.remove(questionItem)
    },
    queryForm() {
      this.questionPage.queryParam.pageIndex = 1
      this.search()
    },
    confirmQuestionSelect() {
      const _this = this
      this.questionPage.multipleSelection.forEach(q => {
        fetchQuestionDetail(q.id).then(res => {
          // 查看结构
          _this.currentTitleItem.questionItems.push(res.data)
        })
      })
      this.questionPage.showDialog = false
    },
    levelChange() {
      this.subjects = this.subjectFilter
      this.form.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.form.gradeLevel)
    },
    search() {
      this.questionPage.queryParam.subjectId = this.form.subjectId
      this.questionPage.listLoading = true
      fetchQuestionList(this.questionPage.queryParam).then(res => {
        console.log('34')
        console.log(res)
        this.questionPage.tableData = res.data.records
        this.questionPage.total = res.data.total
        this.questionPage.queryParam.pageIndex = res.data.pageNum
        this.questionPage.listLoading = false
      })
      // questionApi.pageList(this.questionPage.queryParam).then(data => {
      //   const re = data.response
      //   this.questionPage.tableData = re.list
      //   this.questionPage.total = re.total
      //   this.questionPage.queryParam.pageIndex = re.pageNum
      //   this.questionPage.listLoading = false
      // })
    },
    handleSelectionChange(val) {
      this.questionPage.multipleSelection = val
    },
    questionTypeFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.questionTypeEnum, cellValue)
    },
    subjectFormatter(row, column, cellValue, index) {
      return this.subjectEnumFormat(cellValue)
    },
    resetForm() {
      const lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        level: null,
        subjectId: null,
        paperType: 1,
        limitDateTime: [],
        name: '',
        suggestTime: null,
        titleItems: []
      }
      this.form.id = lastId
    }

  }

}
</script>

<style lang="scss">
  .exampaper-item-box {
    .q-title {
      margin: 0px 5px 0px 5px;
    }
    .q-item-content {
    }
  }
</style>
