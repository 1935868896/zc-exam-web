import Layout from '@/layout'

const tableRouter = {
  path: '/project-mange',
  component: Layout,
  redirect: 'project-mange',
  name: 'project-mange',
  meta: {
    title: '项目管理',
    icon: 'table'
  },
  children: [
    {
      path: 't-subject',
      component: () => import('@/views/project-mange/t-subject'),
      name: 't-subject',
      meta: { title: '年级管理' }
    },
    {
      path: 't-question',
      component: () => import('@/views/project-mange/t-question'),
      name: 't-question',
      meta: { title: '问题管理' }
    },
    {
      path: 't-exam-paper',
      component: () => import('@/views/project-mange/t-exam-paper'),
      name: 't-exam-paper',
      meta: { title: '试卷管理' }
    },
    {
      path: 'do-exam-paper',
      component: () => import('@/views/project-mange/student/exam/paper/do'),
      hidden: true,
      name: 'do-exam-paper',
      meta: { title: '做卷子' }
    },
    {
      path: 'read-exam-paper',
      component: () => import('@/views/project-mange/student/exam/paper/read'),
      hidden: true,
      name: 'read-exam-paper',
      meta: { title: '读卷子' }
    },
    {
      path: 'exam-paper-record',
      component: () => import('@/views/project-mange/student/exam/record'),
      name: 'exam-paper-record',
      meta: { title: '试卷记录' }
    },
    {
      path: 'exam-question-error',
      component: () => import('@/views/project-mange/student/exam/question-error'),
      name: 'exam-question-error',
      meta: { title: '错题本' }
    },
    {
      path: 'single-choice',
      hidden: true,
      component: () => import('@/views/project-mange/question/single-choice'),
      name: 'single-choice',
      meta: { title: '单项选择' }
    },
    {
      path: 'multiple-choice',
      hidden: true,
      component: () => import('@/views/project-mange/question/multiple-choice'),
      name: 'multiple-choice',
      meta: { title: '多项选择' }
    },
    {
      path: 'true-false',
      hidden: true,
      component: () => import('@/views/project-mange/question/true-false'),
      name: 'true-false',
      meta: { title: '判断题' }
    },
    {
      path: 'paper-edit',
      hidden: true,
      component: () => import('@/views/project-mange/paper/edit'),
      name: 'paper-edit',
      meta: { title: '添加试卷' }
    }
  ]
}
export default tableRouter
