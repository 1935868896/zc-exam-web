<template>
  <div>
    <el-row class="do-exam-title">
      <el-col :span="24">
        <span v-for="item in answer.answerItems" :key="item.itemOrder">
          <el-tag :type="questionCompleted(item.completed)" class="do-exam-title-tag" @click="goAnchor('#question-'+item.itemOrder)">{{ item.itemOrder }}</el-tag>
        </span>
        <span class="do-exam-time">
          <label>剩余时间：</label>
          <label>{{ formatSeconds(remainTime) }}</label>
        </span>
      </el-col>
    </el-row>
    <el-row class="do-exam-title-hidden">
      <el-col :span="24">
        <span v-for="item in answer.answerItems" :key="item.itemOrder">
          <el-tag class="do-exam-title-tag">{{ item.itemOrder }}</el-tag>
        </span>
        <span class="do-exam-time">
          <label>剩余时间：</label>
        </span>
      </el-col>
    </el-row>
    <el-container class="app-item-contain">
      <el-header class="align-center">
        <h1>{{ form.name }}</h1>
        <div>
          <span class="question-title-padding">试卷总分：{{ form.score }}</span>
          <span class="question-title-padding">考试时间：{{ form.suggestTime }}分钟</span>
        </div>
      </el-header>
      <el-main>
        <el-form ref="form" v-loading="formLoading" :model="form" label-width="100px">
          <el-row v-for="(titleItem,index) in form.titleItems" :key="index">
            <h3>{{ titleItem.name }}</h3>
            <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
              <el-form-item
                v-for="questionItem in titleItem.questionItems"
                :id="'question-'+ questionItem.itemOrder"
                :key="questionItem.itemOrder"
                :label="questionItem.itemOrder+'.'"
                class="exam-question-item"
                label-width="50px"
              >
                <QuestionEdit
                  :q-type="questionItem.questionType"
                  :question="questionItem"
                  :answer="answer.answerItems[questionItem.itemOrder-1]"
                />
              </el-form-item>
            </el-card>
          </el-row>
          <el-row class="do-align-center">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button>取消</el-button>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import { formatSeconds } from '@/utils'
import QuestionEdit from '../components/QuestionEdit'
import { fetchPaperDetail } from '@/api/project-mange/t-exam-paper'
import store from '@/store'

export default {
  components: { QuestionEdit },
  data() {
    return {
      form: {},
      formLoading: false,
      answer: {
        questionId: null,
        doTime: 0,
        answerItems: []
      },
      timer: null,
      remainTime: 0
    }
  },

  created() {
    const id = 2
    // this.$route.query.id
    const _this = this
    this.doCompletedTag = store.state.enumItem.exam.question.answer.doCompletedTag

    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      fetchPaperDetail(id).then(
        res => {
          _this.form = res.data
          _this.remainTime = res.data.suggestTime * 60
          _this.initAnswer()
          _this.timeReduce()
          _this.formLoading = false
        }
      )
    }
  },
  mounted() {

  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  methods: {
    formatSeconds(theTime) {
      return formatSeconds(theTime)
    },
    timeReduce() {
      const _this = this
      this.timer = setInterval(function() {
        if (_this.remainTime <= 0) {
          _this.submitForm()
        } else {
          ++_this.answer.doTime
          --_this.remainTime
        }
      }, 1000)
    },
    questionCompleted(completed) {
      for (const item of this.doCompletedTag) {
        if (item.completed === completed) {
          return item.value
        }
      }
      return null
    },

    goAnchor(selector) {
      this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
    },
    initAnswer() {
      this.answer.id = this.form.id
      const titleItemArray = this.form.titleItems
      for (const tIndex in titleItemArray) {
        const questionArray = titleItemArray[tIndex].questionItems
        for (const qIndex in questionArray) {
          const question = questionArray[qIndex]
          this.answer.answerItems.push({ questionId: question.id, content: null, contentArray: [], completed: false, itemOrder: question.itemOrder })
        }
      }
    },
    submitForm() {
      const _this = this
      window.clearInterval(_this.timer)
      _this.formLoading = true
      console.log('answer')
      console.log(this.answer)
    //   examPaperAnswerApi.answerSubmit(this.answer).then(re => {
    //     if (re.code === 1) {
    //       _this.$alert('试卷得分：' + re.response + '分', '考试结果', {
    //         confirmButtonText: '返回考试记录',
    //         callback: action => {
    //           _this.$router.push('/record/index')
    //         }
    //       })
    //     } else {
    //       _this.$message.error(re.message)
    //     }
    //     _this.formLoading = false
    //   }).catch(e => {
    //     _this.formLoading = false
    //   })
    }
  }
}
</script>

<style lang="scss" scoped>
  .align-center {
    text-align: center
  }

  .exam-question-item {
    padding: 10px;

    .el-form-item__label {
      font-size: 15px !important;
    }
  }

  .question-title-padding {
    padding-left: 25px;
    padding-right: 25px;
  }
  .do-exam-title {
  width: 100%;
  background: #fff6f6;
  z-index: 999;
  padding: 5px 0px;
}

.do-exam-title-hidden {
  width: 100%;
  visibility: hidden;
  padding: 5px 0px;
}

.do-exam-title-tag {
  margin-left: 5px;
  cursor: pointer;
}

.do-exam-time {
  float: right;
  line-height: 2;
  font-size: 14px;
  padding-right: 5px;
}

.do-align-center {
  text-align: center;
  margin-top: 40px;

  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
