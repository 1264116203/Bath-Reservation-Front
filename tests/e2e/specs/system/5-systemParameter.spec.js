context('SystemParameter', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.visit('/#/system/param')
  })

  it('systemParam-select-01 无输入查询字段查询系统参数信息', function () {
    //  点击“清空”按钮
    cy.get(':nth-child(4) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()
    // 点击“搜索”按钮
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()

    // 开始验证
    cy.get('tbody>tr').contains('是否开启注册功能').should('be.visible')
    cy.get('tbody>tr').contains('账号初始密码').should('be.visible')
  })

  it('systemParam-select-02 输入合法查询字段查询系统参数信息', function () {
    //  点击“清空”按钮
    cy.get(':nth-child(4) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()
    // 在“参数名称”输入框中输入关键字”是否“
    cy.get('#main-content > div:nth-child(1) > div > div > form > div:nth-child(1) > div.ant-col.ant-form-item-control-wrapper > div > span > input').type('是否')
    // 在“参数键名”输入框中输入关键字“account”
    cy.get('#main-content > div:nth-child(1) > div > div > form > div:nth-child(2) > div.ant-col.ant-form-item-control-wrapper > div > span > input').type('account')
    // 点击“搜索”按钮
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()

    // 开始验证
    cy.wait(1000)
    cy.get('tbody>tr').contains('是否开启注册功能').should('be.visible')
    cy.get('tbody>tr').contains('账号初始密码').should('not.exist')
  })

  it('systemParam-select-03 输入非法查询字段查询系统参数信息', function () {
    //  点击“清空”按钮
    cy.get(':nth-child(4) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()
    // 在“参数名称”输入框中输入关键字”是否“
    cy.get('#main-content > div:nth-child(1) > div > div > form > div:nth-child(1) > div.ant-col.ant-form-item-control-wrapper > div > span > input').type('testSystemParam')
    // 在“参数键名”输入框中输入关键字“account”
    cy.get('#main-content > div:nth-child(1) > div > div > form > div:nth-child(2) > div.ant-col.ant-form-item-control-wrapper > div > span > input').type('testSystemParamName')
    // 点击“搜索”按钮
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()

    // 开始验证
    cy.get('tbody>tr').should('not.exist')
  })

  it('systemParam-create-01 输入合法的系统参数数据', function () {
    // 点击添加按钮
    cy.get('.operation-btn-container').find('button').eq(0).click()
    // 在“参数名称”输入框中输入“系统参数”
    cy.get('.ant-modal-body > .ant-form > :nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('系统参数')
    // 在“参数键名”输入框中输入“paramOpen”
    cy.get('.ant-modal-body > .ant-form > :nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('paramOpen')
    // 在“参数键值”输入框输入“isOpen"
    cy.get(':nth-child(3) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('isOpen')

    cy.intercept('/api/system/param/pagination*').as('systemParamPage')
    // 点击“确定”按钮
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    cy.wait('@systemParamPage').then(() => {})

    // 开始验证
    cy.get('.ant-message').contains('数据插入成功').should('be.visible')
    cy.get('tbody>tr').contains('系统参数').should('be.visible')
    // 验证详情框
    cy.get('tbody>tr').contains('isOpen').next().find('a').first().click()
    cy.get('.ant-input-disabled').eq(0).should('have.value', '系统参数')
    cy.get('.ant-input-disabled').eq(1).should('have.value', 'paramOpen')
    cy.get('.ant-input-disabled').eq(2).should('have.value', 'isOpen')
  })

  it('systemParam-create-02 输入的系统参数数据部分置空', function () {
    // 点击添加按钮
    cy.get('.operation-btn-container').find('button').eq(0).click()
    // 在“参数名称”输入框置空
    cy.get('.ant-modal-body > .ant-form > :nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear()
    // 在“参数键名”输入框置空
    cy.get('.ant-modal-body > .ant-form > :nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear()
    // 在“参数键值”输入框输入“isOpen"
    cy.get(':nth-child(3) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('isOpenTest')
    // 点击“确定”按钮
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    // 验证错误的提示信息
    cy.get('.ant-message').contains('校验未通过').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入参数名称').should('be.visible')
    cy.get('.ant-form-explain').eq(1).contains('请输入参数键名').should('be.visible')

    // 验证
    cy.get('tbody>tr').contains('isOpenTest').should('not.exist')
  })

  it('systemParam-create-03 插入重复数据', function () {
    // 点击添加按钮
    cy.get('.operation-btn-container').find('button').eq(0).click()
    // 在“参数名称”输入框中输入“系统参数”
    cy.get('.ant-modal-body > .ant-form > :nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('系统参数')
    // 在“参数键名”输入框中输入“paramOpen”
    cy.get('.ant-modal-body > .ant-form > :nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('paramOpen')
    // 在“参数键值”输入框输入“isOpen"
    cy.get(':nth-child(3) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('isOpen')
    // 点击“确定”按钮
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    // 开始验证
    cy.get('.ant-notification-notice-message').should('have.text', '请求失败')
    cy.get('.ant-notification-notice-description').should('have.text', '参数键为paramOpen的系统参数记录已经存在！')
  })

  it('systemParam-update-01 输入合法的系统参数信息', function () {
    // 点击参数名称为“系统参数”的所在行的“修改”按钮
    cy.get('tbody>tr').contains('isOpen').next().find('a').eq(1).click()
    // 在“参数名称”输入框中输入“系统参数测试”
    cy.get('.ant-modal-body > .ant-form > :nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('系统参数测试')
    // 在“参数键名”输入框中输入“paramOpenTest“
    cy.get('.ant-modal-body > .ant-form > :nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('paramOpenTest')
    // 在“参数键值”输入框中输入“isOpenTest”
    cy.get(':nth-child(3) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('isOpenTest')
    // 点击“确定”按钮
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()

    // 开始验证
    cy.get('tbody>tr').contains('系统参数测试').should('be.visible')
    // 验证详情框
    cy.get('tbody>tr').contains('isOpenTest').next().find('a').first().click()
    cy.get('.ant-input-disabled').eq(0).should('have.value', '系统参数测试')
    cy.get('.ant-input-disabled').eq(1).should('have.value', 'paramOpenTest')
    cy.get('.ant-input-disabled').eq(2).should('have.value', 'isOpenTest')
  })

  it('systemParam-update-02 输入的系统参数数据部分置空', function () {
    // 点击参数名称为“系统参数”的所在行的“修改”按钮
    cy.get('tbody>tr').contains('isOpen').next().find('a').eq(1).click()
    // 在“参数名称”输入框中输入“系统参数测试Update”
    cy.get('.ant-modal-body > .ant-form > :nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('系统参数测试Update')
    // 在“参数键名”输入框置空
    cy.get('.ant-modal-body > .ant-form > :nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear()
    // 在“参数键值”输入框置空
    cy.get(':nth-child(3) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear()
    // 点击“确定”按钮
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()

    // 验证错误的提示信息
    cy.get('.ant-message').contains('校验未通过').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入参数键名').should('be.visible')
    cy.get('.ant-form-explain').eq(1).contains('请输入参数键值').should('be.visible')
    // 验证
    cy.get('tbody>tr').contains('系统参数测试Update').should('not.exist')
  })

  it('systemParam-update-03 验证修改查重', function () {
    // 点击参数名称为“系统参数”的所在行的“修改”按钮
    cy.get('tbody>tr').contains('isOpenTest').next().find('a').eq(1).click()
    // 在“参数名称”输入框中输入“是否开启注册功能”
    cy.get('.ant-modal-body > .ant-form > :nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('是否开启注册功能')
    // 在“参数键名”输入框中输入account.register-user
    cy.get('.ant-modal-body > .ant-form > :nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('account.register-user')
    // 在“参数键值”输入框中输入“true”
    cy.get(':nth-child(3) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').clear().type('true')
    // 开始验证
    // 点击“确定”按钮
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    cy.wait(500)
    // 开始验证
    cy.get('.ant-notification-notice-message').should('have.text', '请求失败')
    cy.get('.ant-notification-notice-description').should('have.text', '参数键为account.register-user的系统参数记录已经存在！')
  })

  it('systemParam-delete-01 无选择数据删除', function () {
    // 点击”批量删除“按钮
    cy.get('.ant-btn-danger').click()

    // 开始验证
    cy.get('.ant-message').contains('请选择至少一条数据').should('be.visible')
    cy.get('tbody>tr').contains('是否开启注册功能').should('be.visible')
    cy.get('tbody>tr').contains('账号初始密码').should('be.visible')
  })

  it('systemParam-delete-02 删除单条系统参数信息', function () {
    // 点击参数名称为“系统参数”的所在行的“删除”按钮
    cy.get('tbody>tr').contains('paramOpenTest').next().next().find('a').eq(2).click()
    // 点击弹出框的“确定”按钮
    cy.get('.ant-popover-buttons').contains('确 定').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    cy.get('tbody>tr').contains('paramOpenTest').should('not.exist')
  })

  it('systemParam-delete-03 批量删除系统参数信息', function () {
    // 勾选参数名称为“是否开启注册功能”的所在行的复选框
    cy.get('tbody>tr').contains('是否开启注册功能').prev().click()
    // 勾选参数名称为“是否开启注册功能”的所在行的复选框
    cy.get('tbody>tr').contains('账号初始密码').prev().click()
    // 点击“批量删除”按钮
    cy.get('.ant-btn-danger').click()
    // 点击弹出框的“是”按钮
    cy.get('.ant-modal-confirm-btns').contains('是').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    cy.get('tbody>tr').should('not.exist')
  })
})
