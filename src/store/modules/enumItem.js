// initial state
const state = {
  user: {
    sexEnum: [{ key: 1, value: '男' }, { key: 2, value: '女' }],
    statusEnum: [{ key: 1, value: '启用' }, { key: 2, value: '禁用' }],
    levelEnum: new Map([
      [1, '一年级'], [2, '二年级'], [3, '三年级'], [4, '四年级'], [5, '五年级'], [6, '六年级']]),
    statusTag: [{ key: 1, value: 'success' }, { key: 2, value: 'danger' }],
    statusBtn: [{ key: 1, value: '禁用' }, { key: 2, value: '启用' }]
  },
  exam: {
    examPaper:
    {
      paperTypeEnum: new Map([[1, '固定试卷'], [4, '时段试卷'], [6, '任务试卷']])
    },
    question: {
      typeEnum: new Map([
        [1, '单选题'], [2, '多选题'], [3, '判断题'], [4, '填空题'], [5, '简答题']
      ]),
      editUrlEnum: new Map([
        [1, '/project-mange/single-choice'], [2, '/project-mange/multiple-choice'], [3, '/project-mange/true-false']
      ])

      // editUrlEnum: [{ key: 1, value: '/exam/question/edit/singleChoice', name: '单选题' },
      //   { key: 2, value: '/exam/question/edit/multipleChoice', name: '多选题' },
      //   { key: 3, value: '/exam/question/edit/trueFalse', name: '判断题' },
      //   { key: 4, value: '/exam/question/edit/gapFilling', name: '填空题' },
      //   { key: 5, value: '/exam/question/edit/shortAnswer', name: '简答题' }]
    }
  }
}

// getters
const getters = {
  enumFormat: (state) => (arrary, key) => {
    return format(arrary, key)
  }
}

// actions
const actions = {}

// mutations
const mutations = {}

const format = function(array, key) {
  for (const item of array) {
    if (item.key === key) {
      return item.value
    }
  }
  return null
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
