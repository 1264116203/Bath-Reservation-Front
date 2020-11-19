import { ACTION_TYPE } from '@/config/constants'

export default {
  data() {
    return {
      /** 当前数据项的id，新增时则为空 */
      id: '',
      /** 对话框标题 */
      title: '',
      /** 动作类型，可选值：creation/detail/update */
      actionType: ACTION_TYPE.CREATION,
      /** 表单项是否可编辑 */
      isDisable: false,
      /** 对话框的显隐状态 */
      isModalVisible: false,
      /** 加载状态 */
      spinning: false,
      formData: {},

      FormDataClass: function() {},
      axiosGetById: function (id) {},
      axiosAdd: function () {},
      axiosUpdate: function () {}
    }
  },
  methods: {
    /**
     * 初始化组件，必须在created时调用
     * @param { Object } options  选项信息
     * @param options.FormDataClass 表单数据模型ES6类，本质上也可以用函数代替
     * @param options.axiosGetById 根据id获取数据的Axios HTTP请求方法
     * @param options.axiosAdd 添加新数据的Axios HTTP请求方法
     * @param options.axiosUpdate 更新数据的Axios HTTP请求方法
     */
    setup(options) {
      Object.assign(this, options)
      this.formData = new this.FormDataClass()
    },
    /**
     * 打开对话框的方法，由父组件调用
     * @param { string } type 打开类型，从<code>ACTION_TYPE</code>中选择
     * @param { string } [id] 待处理记录的id，仅在查看详情和更新记录是使用
     * @return {Promise<void>}
     */
    async open(type, id) {
      this.setModelTitle(type)
      this.isModalVisible = true
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      if (type !== ACTION_TYPE.CREATION && id) {
        this.id = id
        this.actionType = type
        // 拉取服务期最新数据并赋值给组件的formData
        await this.getRecordById()
      } else {
        this.id = null
        this.actionType = ACTION_TYPE.CREATION
        this.formData = new this.FormDataClass()
      }
    },

    /** 缺省的对话框标题设置，可以通过重写修改之 */
    setModelTitle(type) {
      switch (type) {
        case ACTION_TYPE.CREATION:
          this.title = '添加信息'
          this.isDisable = false
          break
        case ACTION_TYPE.DETAIL:
          this.title = '查看信息'
          this.isDisable = true
          break
        case ACTION_TYPE.UPDATE:
        default:
          this.title = '修改信息'
          this.isDisable = false
      }
    },

    /** 下拉弹层渲染节点固定在触发器的父元素中 */
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode
    },
    /**
     * 根据id拉取服务器数据
     *
     * 如果不符合需求可以重写本方法
     * @return {Promise<void>}
     */
    async getRecordById() {
      this.spinning = true
      try {
        this.formData = (await this.axiosGetById(this.id)).data
      } catch (error) {
        console.error(error)
      }
      this.spinning = false
    },
    /**
     * 缺省的添加记录处理
     *
     * 自带一系列默认行为，如管理对话框加载状态等
     * 如果不符合需求可以重写
     */
    async commonAdd() {
      this.spinning = true
      const formData = this.getFormDataForCreation()

      try {
        await this.axiosAdd(formData)
        this.$emit('ok', this.actionType, formData)
        this.$message.success('数据插入成功!')
        this.isModalVisible = false
      } catch (error) {
        console.error(error)
      }

      this.spinning = false
    },
    /**
     * 缺省的修改记录处理
     *
     * 自带一系列默认行为，如管理对话框加载状态等
     * 如果不符合需求可以重写
     */
    async commonUpdate() {
      this.spinning = true
      const formData = this.getFormDataForUpdate()

      try {
        await this.axiosUpdate(formData)
        this.$emit('ok', this.actionType, formData)
        this.$message.success('数据更新成功!')
        this.isModalVisible = false
      } catch (error) {
        console.error(error)
      }

      this.spinning = false
    },
    /**
     * 生成添加数据时要使用的数据
     *
     * 默认直接传入this.formData
     * 如果不符合需求可以重写
     *
     * @return {*} 要推送给服务器的数据
     */
    getFormDataForCreation() {
      return ({ ...this.formData })
    },
    /**
     * 生成更新数据时要使用的数据
     *
     * 默认直接传入this.formData + this.id
     * 如果不符合需求可以重写
     *
     * @return {*} 要推送给服务器的数据
     */
    getFormDataForUpdate() {
      return ({
        id: this.id,
        ...this.getFormDataForCreation()
      })
    },

    /** 重设表单数据 */
    reset() {
      this.formData = new this.FormDataClass()
    },

    /** 点击对话框确认按钮后的回调 */
    onOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('校验未通过！')
          return false
        }
      })
    },
    /** 点击对话框取消按钮后的回调 */
    onCancel() {
      this.$emit('cancel')
    },

    onSubmit() {
      switch (this.actionType) {
        case 'creation':
          this.onAdd()
          break
        case 'update':
          this.onUpdate()
          break
        case 'detail':
        default:
          this.onDetail()
      }
    },

    onAdd() {
      this.commonAdd()
    },
    onUpdate() {
      this.commonUpdate()
    },
    onDetail() {
      this.$emit('ok', this.actionType)
      this.isModalVisible = false
    }
  }
}
