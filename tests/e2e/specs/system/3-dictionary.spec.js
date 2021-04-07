context('Dictionary', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.visit('/#/system/dict')
  })

  it('dictionary-select-01 输入非法查询字段查询字典信息', function () {
    // 在字典编码输入框中输入testdictionary
    cy.get(':nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('testdictionary')
    // 在字典名称输入框输入测试字典
    cy.get(':nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('测试字典').click()
    // 点击“搜索"按钮
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()

    // 开始验证
    // 字典列表中无数据
    cy.get('tbody>tr').should('not.exist')
  })

  it('dictionary-select-02 输入合法查询字段查询字典信息', function () {
    // 在字典编码输入框中输入sex
    cy.get(':nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('性别')
    // 在字典名称输入框输入性别
    cy.get(':nth-child(2) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('sex')
    // 点击”搜索“按钮
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()

    // 开始验证
    // 字典列表中有sex数据
    cy.get('tbody>tr').contains('sex').should('be.visible')
    // 点击字典编码为sex的所在行的”查看“按钮
    cy.get('tbody>tr').contains('sex').parent().find('td').last().find('a').first().click()
    // 验证字典信息
    cy.get('.d2-col-form ').find('input').eq(0).should('have.value', '性别')
    cy.get('.d2-col-form ').find('input').eq(1).should('have.value', 'sex')
    cy.get('.d2-col-form ').find('input').eq(2).should('have.value', '1')
    // 验证字典项信息
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').should('have.value', '男')
    cy.get('.ant-table-tbody').last().find('tr').eq(1).find('td').eq('1').find('input').should('have.value', '女')
    cy.get('.ant-table-tbody').last().find('tr').eq(2).find('td').eq('1').find('input').should('have.value', '保密')
  })

  it('dictionary-select-03 无输入查询字段查询字典信息', function () {
    cy.get(':nth-child(4) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()

    // 开始验证
    // 字典列表中有sex数据
    cy.get('tbody>tr').contains('sex').should('be.visible')
    // 点击字典编码为sex的所在行的”查看“按钮
    cy.get('tbody>tr').contains('sex').parent().find('td').last().find('a').first().click()
    // 验证字典信息
    cy.get('input[placeholder="请输入字典名称"]').should('have.value', '性别')
    cy.get('input[placeholder="请输入字典编码"]').should('have.value', 'sex')
    cy.get('input[placeholder="请输入字典排序"]').should('have.value', '1')
    // 验证字典项信息
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').should('have.value', '男')
    cy.get('.ant-table-tbody').last().find('tr').eq(1).find('td').eq('1').find('input').should('have.value', '女')
    cy.get('.ant-table-tbody').last().find('tr').eq(2).find('td').eq('1').find('input').should('have.value', '保密')
  })

  it('dictionary-create-01 正确字典信息输入', function () {
    // 点击”添加“按钮
    cy.get('.ant-btn-primary').eq(1).click()
    // 在字典名称输入框输入”字典“
    cy.get('input[placeholder="请输入字典名称"]').clear().type('字典')
    // 在字典编码输入框中输入”testDictionary“
    cy.get('input[placeholder="请输入字典编码"]').clear().type('dictionary01')
    // 在字典排序输入框中输入”10“
    cy.get('input[placeholder="请输入字典排序"]').clear().type('10')
    // 在字典备注框中输入”测试字典“
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('测试字典')
    // 点击弹出框中”添加“按钮
    cy.get('.ant-btn-primary').eq(2).click()
    // 在字典项名输入框中输入”字典项“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').type('字典项')
    // 在字典项值输入框中输入”dictionaryEntry“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('2').find('input').type('entry')
    // 在备注输入框中输入”测试字典项“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('3').find('input').type('测试字典项')
    // 点击”添加“按钮
    cy.get('.ant-modal-footer').contains('确 定').click()
    cy.reload()

    // 验证字典列表
    cy.get('tbody>tr').contains('dictionary01').should('be.visible')
    // 验证字典项列表
    cy.get('tbody>tr').contains('测试字典').next().find('a').first().click()
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').should('have.value', '字典项')
  })

  it('dictionary-create-02 字典数据输入表单部分数据置空', function () {
    // 点击”添加“按钮
    cy.get('.ant-btn-primary').eq(1).click()
    // 在字典名称输入框置空
    cy.get('input[placeholder="请输入字典名称"]').clear()
    // 在字典编码输入框置空
    cy.get('input[placeholder="请输入字典编码"]').clear()
    // 在字典排序输入框置空
    cy.get('input[placeholder="请输入字典排序"]').clear()
    // 在字典备注框中输入”测试字典“
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('dictionary remark')
    // 点击”添加“按钮
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 验证错误的提示信息
    cy.get('.ant-message').contains('校验未通过').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入字典名称').should('be.visible')
    cy.get('.ant-form-explain').eq(1).contains('请输入字典编码').should('be.visible')
    cy.get('.ant-form-explain').eq(2).contains('请输入字典排序').should('be.visible')
    // 点击”取消“按钮
    cy.get('.ant-modal-footer').contains('取 消').click()
    cy.reload()
    // 验证
    cy.get('tbody>tr').contains('dictionary remark').should('not.exist')
  })

  it('dictionary-create-03 非法字典信息输入', function () {
    // 点击”添加“按钮
    cy.get('.ant-btn-primary').eq(1).click()
    // 在字典名称输入框输入”字典“
    cy.get('input[placeholder="请输入字典名称"]').clear().type('字典')
    // 在字典编码输入框中输入”testDictionary“
    cy.get('input[placeholder="请输入字典编码"]').clear().type('testDictionary01')
    // 在字典排序输入框中输入”testDictionary“
    cy.get('input[placeholder="请输入字典排序"]').clear().type('testDictionary')
    // 在字典备注框中输入”测试字典“
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('dictionary remark')
    // 点击”确定“按钮
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 验证错误的提示信息
    cy.get('.ant-message').contains('校验未通过').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入字典排序').should('be.visible')
    cy.get('.ant-modal-footer').contains('取 消').click()

    // 开始
    cy.get('tbody>tr').contains('dictionary remark').should('not.exist')
  })

  it('dictionary-create-04 插入重复的字典编码', function () {
    // 点击”添加“按钮
    cy.get('.ant-btn-primary').eq(1).click()
    cy.get('input[placeholder="请输入字典名称"]').clear().type('字典')
    // 在字典编码输入框中输入”testDictionary“
    cy.get('input[placeholder="请输入字典编码"]').clear().type('dictionary01')
    // 在字典排序输入框中输入”10“
    cy.get('input[placeholder="请输入字典排序"]').clear().type('10')
    // 在字典备注框中输入”测试字典“
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('测试字典')

    // 点击”添加“按钮
    cy.get('.ant-modal-footer').contains('确 定').click()

    // 验证
    cy.wait(300)
    // 验证字典列表
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为dictionary01的字典记录已经存在！')
  })

  it('dictionary-update-01 正确输入字典信息', function () {
    // 点击dictionary01所在行的“修改”按钮
    cy.get('tbody>tr').contains('dictionary01').parent().find('td').last().find('a').eq(1).click()
    // 在字典名称框中输入“动物城”
    cy.get('input[placeholder="请输入字典名称"]').clear().type('动物城')
    // 在字典编码输入框中输入“animal city”
    cy.get('input[placeholder="请输入字典编码"]').clear().type('animal city')
    // 在字典排序输入框中输入“2”
    cy.get('input[placeholder="请输入字典排序"]').clear().type('2')
    // 在字典备注输入框中输入“欢迎来到动物城"
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('欢迎来到动物城')
    // 在字典项名输入框中输入”熊猫“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').clear().type('熊猫')
    // 在字典项值输入框中输入”panda“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('2').find('input').clear().type('panda')
    // 在备注输入框中输入”国宝“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('3').find('input').clear().type('国宝')
    // 点击“确定”按钮
    cy.get('.ant-modal-footer').contains('确 定').click()

    // 开始验证
    cy.get('.ant-message').contains('数据更新成功').should('be.visible')
    // 验证字典列表
    cy.get('tbody>tr').contains('animal city').should('be.visible')
    // 验证字典项列表
    cy.get('tbody>tr').contains('欢迎来到动物城').next().find('a').eq(1).click()
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').should('have.value', '熊猫')
  })

  it('dictionary-update-02 字典数据输入,表单的部份数据置空', function () {
    // 点击dictionary01所在行的“修改”按钮
    cy.get('tbody>tr').contains('animal city').parent().find('td').last().find('a').eq(1).click()
    // 在字典名称输入框置空
    cy.get('input[placeholder="请输入字典名称"]').clear()
    // 在字典编码输入框置空
    cy.get('input[placeholder="请输入字典编码"]').clear()
    // 在字典排序输入框中输入“2”
    cy.get('input[placeholder="请输入字典排序"]').clear().type('2')
    // 在字典备注输入框中输入“欢迎来到动物城"
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('welcome come to animal city')
    // 点击确定按钮
    // 点击“确定”按钮
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 验证错误的提示信息
    cy.get('.ant-message').contains('校验未通过').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入字典名称').should('be.visible')
    cy.get('.ant-form-explain').eq(1).contains('请输入字典编码').should('be.visible')

    cy.reload()
    // 验证字典列表
    cy.get('tbody>tr').contains('welcome come to animal city').should('not.exist')
  })

  it('dictionary-update-03 进行非法的数据输入', function () {
    // 点击dictionary01所在行的“修改”按钮
    cy.get('tbody>tr').contains('animal city').parent().find('td').last().find('a').eq(1).click()
    // 在字典名称输入框置空
    cy.get('input[placeholder="请输入字典名称"]').clear().type('动物城Second')
    // 在字典编码输入框置空
    cy.get('input[placeholder="请输入字典编码"]').clear().type('animal city')
    // 在字典排序输入框中输入“2”
    cy.get('input[placeholder="请输入字典排序"]').clear().type('dictionary')
    // 在字典备注输入框中输入“欢迎来到动物城"
    cy.get('textarea[placeholder="请输入字典备注"]').clear().type('欢迎来到动物城')
    // 在字典项名输入框中输入”熊猫“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('1').find('input').clear().type('熊猫')
    // 在字典项值输入框中输入”panda“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('2').find('input').clear().type('panda')
    // 在备注输入框中输入”国宝“
    cy.get('.ant-table-tbody').last().find('tr').eq(0).find('td').eq('3').find('input').clear().type('国宝')
    // 点击“确定”按钮
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 验证错误的提示信息
    cy.get('.ant-message').contains('校验未通过').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入字典排序').should('be.visible')

    // 开始验证
    // 验证字典列表
    cy.get('tbody>tr').contains('动物城Second').should('not.exist')
  })

  it('dictionary-update-04 验证修改查重', function () {
    cy.get('tbody>tr').contains('animal city').parent().find('td').last().find('a').eq(1).click()
    cy.get('input[placeholder="请输入字典编码"]').clear().type('sex')
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    // /验证
    cy.wait(300)
    // 验证字典列表
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为sex的字典记录已经存在！')
  })

  it('dictionary-delete-01 单个删除字典项信息', function () {
    // 点击dictionary01所在行的“修改”按钮
    cy.get('tbody>tr').contains('animal city').parent().find('td').last().find('a').eq(1).click()
    // 点击熊猫所在行的“删除”图标
    cy.get('tbody.ant-table-tbody').eq(1).find('td').last().find('button').last().click()
    // 点击弹出框的“确 定”按钮
    cy.get('.ant-popover-buttons').contains('确 定').click()
    // 点击“确定”按钮
    cy.get('.ant-modal-footer').contains('确 定').click()
    cy.reload()

    // 开始验证
    cy.get('tbody>tr').contains('animal city').parent().find('td').last().find('a').eq(1).click()
    cy.get('.ant-table-tbody').last().find('tr').should('not.exist')
  })

  it('dictionary-delete-02 单个删除字典信息', function () {
    // 点击dictionary01所在行的“删除”按钮
    cy.get('tbody>tr').contains('animal city').parent().find('td').last().find('a').eq(2).click()
    // 点击弹出框的“确 定”按钮
    cy.get('.ant-popover-buttons').contains('确 定').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    cy.get('tbody>tr').contains('animal city').should('not.exist')
  })
})
