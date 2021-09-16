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
      <el-form-item label="题干：" prop="title">
        <el-input v-model="form.questionObject.titleContent" @focus="inputClick(form,'title')" />
      </el-form-item>
      <el-form-item label="选项：">
        <el-form-item v-for="(item,index) in form.questionObject.questionItemObjects" :key="item.prefix" :label="item.prefix" label-width="50px" class="question-item-label">
          <el-input v-model="item.prefix" style="width:50px;" />
          <el-input v-model="item.content" class="question-item-content-input" style="  margin-left: 8px; width: 60%;" @focus="inputClick(item,'content')" />
          <el-button type="danger" size="mini" class="question-item-remove" icon="el-icon-delete" style="margin-left: 20px;" @click="questionItemRemove(index)" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="解析：" prop="analyze">
        <el-input v-model="form.questionObject.analyze" @focus="inputClick(form,'analyze')" />
      </el-form-item>
      <el-form-item label="分数：" prop="score" required>
        <el-input-number v-model="form.score" :precision="1" :step="1" :max="100" />
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="form.difficult" class="question-item-rate" />
      </el-form-item>
      <el-form-item label="正确答案：" prop="correctArray" required>
        <el-checkbox-group v-model="form.correctArray">
          <el-checkbox v-for="item in form.questionObject.questionItemObjects" :key="item.prefix" :label="item.prefix">{{ item.prefix }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="questionItemAdd">添加选项</el-button>
        <el-button type="success" @click="showQuestion">预览</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="richEditor.dialogVisible" append-to-body :close-on-click-modal="false" style="width: 100%;height: 100%" :show-close="false" center>
      <Ueditor @ready="editorReady" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editorConfirm">确 定</el-button>
        <el-button @click="richEditor.dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
      <QuestionShow :q-type="questionShow.qType" :question="questionShow.question" :q-loading="questionShow.loading" />
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { getList } from '@/api/project-mange/t-subject'
import { create } from '@/api/project-mange/t-question'
export default {

  data() {
    return {
      form: {
        id: null,
        questionType: 1,
        gradeLevel: null,
        subjectId: null,
        levelEnumMap: null,
        typeEnumMap: null,
        questionObject: {
          titleContent: '',
          analyze: '',
          questionItemObjects: [{ prefix: 'A', content: '' },
            { prefix: 'B', content: '' },
            { prefix: 'C', content: '' },
            { prefix: 'D', content: '' }],
          correct: [],
          correctArray: []

        },
        correct: '',
        correctArray: [],
        score: '',
        difficult: 0
      },
      subjectFilter: null,
      formLoading: false,
      rules: {
        // gradeLevel: [
        //   { required: true, message: '请选择年级', trigger: 'change' }
        // ],
        // subjectId: [
        //   { required: true, message: '请选择学科', trigger: 'change' }
        // ],
        // title: [
        //   { required: true, message: '请输入题干', trigger: 'blur' }
        // ],
        // analyze: [
        //   { required: true, message: '请输入解析', trigger: 'blur' }
        // ],
        // score: [
        //   { required: true, message: '请输入分数', trigger: 'blur' }
        // ],
        // correct: [
        //   { required: true, message: '请选择正确答案', trigger: 'change' }
        // ]
      },
      richEditor: {
        dialogVisible: false,
        object: null,
        parameterName: '',
        instance: null
      },
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      }
    }
  },
  computed: {

  },
  created() {
    this.levelEnumMap = store.state.enumItem.user.levelEnum
    this.typeEnumMap = store.state.enumItem.exam.question.typeEnum
    getList().then(res => {
      this.subjectFilter = res.data
    })
  },
  methods: {
    levelChange() {
      console.log('测试')
      console.log(this.form.gradeLevel)
      console.log(this.subjectFilter)
      this.subjects = this.subjectFilter
      this.form.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.form.gradeLevel)
    },
    questionItemRemove(index) {
      this.form.items.splice(index, 1)
    },
    questionItemAdd() {
      const items = this.form.items
      let newLastPrefix
      if (items.length > 0) {
        const last = items[items.length - 1]
        newLastPrefix = String.fromCharCode(last.prefix.charCodeAt() + 1)
      } else {
        newLastPrefix = 'A'
      }
      items.push({ id: null, prefix: newLastPrefix, content: '' })
    },
    submitForm() {
      this.form.questionObject.correct = this.form.correct
      create(this.form).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetForm() {
      const lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        questionType: 1,
        gradeLevel: null,
        subjectId: null,
        title: '',
        items: [
          { prefix: 'A', content: '' },
          { prefix: 'B', content: '' },
          { prefix: 'C', content: '' },
          { prefix: 'D', content: '' }
        ],
        analyze: '',
        correct: '',
        score: '',
        difficult: 0
      }
      this.form.id = lastId
    },
    showQuestion() {
      this.questionShow.dialog = true
      this.questionShow.qType = this.form.questionType
      this.questionShow.question = this.form
    }

  }
}
</script>
<style scoped>
.question-item-label {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
</style>
