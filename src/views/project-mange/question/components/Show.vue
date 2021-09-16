<template>
  <div style="line-height:1.8">
    <div v-if="qType==1" v-loading="qLoading">
      <div class="q-title" v-html="question.titleContent" />
      <div class="q-content" style="">
        <span v-for="item in question.questionItemObjects" :key="item.id" class="q-item-contain">
          <span class="q-item-prefix">{{ item.prefix }}</span>
          <span class="q-item-content" v-html="item.content" />
        </span>
      </div>
    </div>
    <div v-else-if="qType==2" v-loading="qLoading">
      <div class="q-title" v-html="question.titleContent" />
      <div class="q-content">
        <span v-for="item in question.questionItemObjects" :key="item.id" class="q-item-contain">
          <span class="q-item-prefix">{{ item.prefix }}</span>
          <span class="q-item-content" v-html="item.content" />
        </span>
      </div>
    </div>
    <div v-else-if="qType==3" v-loading="qLoading">
      <div class="q-title" style="display: inline;margin-right: 10px" v-html="question.title" />
      <span>（</span>
      <span v-for="item in question.items" :key="item.id">
        <span class="q-item-content" v-html="item.content" />
      </span>
      <span>）</span>
    </div>
    <div v-else-if="qType==4" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
    </div>
    <div v-else-if="qType==5" v-loading="qLoading">
      <div class="q-title" v-html="question.title" />
    </div>
    <div v-else />
  </div>

</template>

<script>
export default {
  name: 'QuestionShow',
  props: {
    question: {
      type: Object,
      default: function() {
        return {}
      }
    },
    qLoading: {
      type: Boolean,
      default: false
    },
    qType: {
      type: Number,
      default: 0
    }
  },
  methods: {}
}
</script>
<style scoped>
.q-title {
  margin: 0px 5px;

}

.q-content {

}

.q-item-prefix {
  margin: 5px 10px;
}

.q-item-contain {
  display: inline-block;
}

.q-item-content {
  margin: 5px;
  white-space: normal;

  /* p {
    display: inline !important;
  } */
}
</style>
