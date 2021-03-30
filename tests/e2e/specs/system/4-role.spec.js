context('Role', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.intercept('/api/system/role/query*').as('query')
    cy.intercept('/api/system/role/tree').as('roleTree')
    cy.intercept('/api/system/authority/tree').as('authorityTree')
    cy.intercept('/api/system/top-menu/list').as('topMenuList')
    cy.toModule('系统管理', '系统管理', '角色及授权管理', false)
    cy.wait(['@query', '@roleTree', '@authorityTree', '@topMenuList']).then(() => {
    })
  })

  it('role-select-01 正确输入查询字段查询角色信息', () => {
    // 在角色名称输入框中输入“人”
    cy.get('.ant-input').eq(0).type('人')
    // 在角色编码输入框中输入“hr”
    cy.get('.ant-input').eq(1).type('hr')
    // 点击“搜索”按钮
    cy.intercept('/api/system/role/query*').as('query')
    cy.get('.ant-btn-primary').eq(0).click()
    cy.wait('@query')
    // 开始验证
    cy.get('tbody>tr').contains('人事').should('be.visible')
    cy.get('tbody>tr').contains('用户').should('not.exist')
  })

  it('role-select-02 无输入查询字段查询角色信息', () => {
    // 清空角色名称输入框中的输入信息
    cy.get('.ant-input').eq(0).clear()
    // 清空角色编码输入框中的输入信息
    cy.get('.ant-input').eq(1).clear()
    // 点击“搜索”按钮
    cy.intercept('/api/system/role/query*').as('query')
    cy.get('.ant-btn-primary').eq(0).click()
    cy.wait('@query')

    // 开始验证
    cy.get('tbody>tr').eq(0).find('td').first().next().should('have.text', '超级管理员')
      .next().should('have.text', 'superadmin').next().should('have.text', '2')
    cy.get('tbody>tr').eq(1).find('td').first().next().should('have.text', '用户')
      .next().should('have.text', 'user').next().should('have.text', '2')
    // 点击user所在行的“+”按钮，展开user的下拉菜单
    cy.get('.ant-table-row-collapsed').click()
    cy.get('tbody>tr').eq(2).find('td').first().next().should('have.text', '人事')
      .next().should('have.text', 'hr').next().should('have.text', '1')
  })

  it('role-select-03 输入非法的查询字段查询角色信息', () => {
    // 清空角色名称输入框中的输入信息
    cy.get('.ant-input').eq(0).type('testrole')
    // 清空角色编码输入框中的输入信息
    cy.get('.ant-input').eq(1).type('测试角色')
    // 点击“搜索”按钮
    cy.intercept('/api/system/role/query*').as('query')
    cy.get('.ant-btn-primary').eq(0).click()
    cy.wait('@query')

    // 开始验证
    cy.get('tbody>tr').should('not.exist')
  })

  it('role-autority-01 删除权限', () => {
    // 点击superadmin所在行的“权限设置”按钮
    cy.get('.ant-table-tbody>').eq(0).contains('superadmin').next().next().contains('授予权限').click()
    // 在弹出框中取消勾选“字典管理”前面的复选框
    cy.get('.ant-tree-icon-hide>li>ul>li').contains('字典管理').parent().prev().click()
    // 点击“确定”按钮
    cy.intercept('/api/system/role/grant').as('roleGrant')
    cy.get('.ant-modal-footer').contains('确 定').click()
    cy.get('@roleGrant').then(() => {
      // 开始验证
      // 刷新页面
      cy.reload()
      cy.get('.ant-menu-submenu-selected').contains('字典管理').should('not.exist')
    })
  })

  it('role-autority-02 添加权限', () => {
    // 点击superadmin所在行的“权限设置”按钮
    cy.get('.ant-table-tbody>').eq(0).contains('superadmin').next().next().contains('授予权限').click()
    // 在弹出框中取消勾选“字典管理”前面的复选框
    cy.get('.ant-tree-icon-hide>li>ul>li').contains('字典管理').parent().prev().click()
    // 点击“确定”按钮
    cy.intercept('/api/system/role/grant').as('roleGrant')
    cy.get('.ant-modal-footer').contains('确 定').click()
    cy.get('@roleGrant').then(() => {
      // 开始验证
      // 刷新页面
      cy.reload()
      cy.get('.ant-menu-submenu-selected').contains('字典管理').should('be.visible')
    })
  })
  
  it('role-create-01 正确的角色数据输入', () => {
    // 点击添加按钮
    cy.get('.ant-btn-primary').eq(1).click()
    //  输入角色名称
    cy.get('input[placeholder="请输入角色名称"]').clear().type('testRole')
    // 输入角色编码
    cy.get('input[placeholder="请输入角色编码"]').clear().type('100')
    cy.intercept('/api/system/role*').as('insertAndQuery')
    // 点击确定按妞
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 操作完毕开始验证
    cy.wait('@insertAndQuery').then(() => {
    })
    // 验证最后一行是否插入成功
    cy.get('tbody>tr').contains('testRole')
      .should('have.text', 'testRole')
      .next().should('have.text', '100')
      .next().should('have.text', '100')
      // 验证框详情
      .next().find('a').first().click()
    cy.get('input[placeholder="请输入角色名称"]').should('have.value', 'testRole')
    cy.get('input[placeholder="请输入角色编码"]').should('have.value', '100')
    cy.get('input[placeholder="请输入角色排序"]').should('have.value', '100')
    cy.get('.ant-modal-footer').contains('取 消').click()
  })

  it.skip('role-create-02 角色数据输入，表单的部分数据置空', () => {
    // 点击添加按钮
    cy.get('.ant-btn-primary').eq(1).click()
    //  输入角色名称
    cy.get('input[placeholder="请输入角色名称"]').type('testRole-02')
    cy.get('input[placeholder="请输入角色排序"]').clear()
    // 点击确定按妞
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 验证提示错误的红色字体
    cy.wait(800)
    cy.get('.ant-message').contains('校验失败')
    cy.get('.has-error').eq(0).contains('请输入角色编码').should('be.visible')
    cy.get('.has-error').eq(1).contains('请输入角色排序').should('be.visible')
    // 点击取消按钮
    cy.get('.ant-modal-footer').contains('取 消').click()

    // 验证
    cy.get('tbody>tr').contains('testRole-02').should('not.exist')
  })

  it.skip('role-create-03 进行非法的数据输入', () => {
    // 点击添加按钮
    cy.get('.ant-btn-primary').eq(1).click()
    //  输入角色名称
    cy.get('input[placeholder="请输入角色名称"]').type('testRole-02')
    // 输入角色编码
    cy.get('input[placeholder="请输入角色编码"]').type('RT')
    // 点击确定按妞
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 验证错误的提示信息
    cy.wait(800)
    cy.get('.ant-message').contains('校验失败')
    cy.get('.ant-form-explain').contains('只能是3-64个英文字符、数字或连字符')
    // 点击取消按钮
    cy.get('.ant-modal-footer').contains('取 消').click()

    // 验证
    cy.get('tbody>tr').contains('testRole-02').should('not.exist')
  })

  it('role-create-04 插入重复数据', () => {
    // 点击添加按钮
    cy.get('.ant-btn-primary').eq(1).click()
    //  输入角色名称
    cy.get('input[placeholder="请输入角色名称"]').clear().type('testRole')
    // 输入角色编码
    cy.get('input[placeholder="请输入角色编码"]').clear().type('100')
    // 点击确定按妞
    cy.get('.ant-modal-footer').contains('确 定').click()
    cy.wait(500)
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为100的角色记录已经存在！')
  })

  it('role-update-01 正确进行角色数据输入', () => {
    // 点击testRole所在行的“修改”按钮
    cy.get('tbody').contains('testRole').parent().find('td').last().find('div>a').eq(1)
      .click()
    // 将testRole的角色编码有100改为testRoleCode
    cy.get('input[placeholder="请输入角色编码"]').clear().type('testRoleCode')
    // 将testRole的角色排序有100改为2
    cy.get('input[placeholder="请输入角色排序"]').clear().type('2')
    // 点击确定
    cy.intercept('/api/system/role*').as('insert')
    cy.get('.ant-modal-footer').contains('确 定').click()
    cy.wait('@insert')

    // 操作完毕开始验证

    cy.get('tbody>tr').contains('testRoleCode')
      .next().should('have.text', '2')
      .next().find('a').first().click()

    // 验证详情框

    cy.get('input[placeholder="请输入角色编码"]').should('have.value', 'testRoleCode')
    cy.get('input[placeholder="请输入角色排序"]').should('have.value', '2')
    cy.get('.ant-modal-footer').contains('取 消').click()
  })

  it.skip('role-update-02 角色数据输入，表单的部份数据置空', () => {
    // 点击testRole所在行的“修改”按钮
    cy.get('tbody').contains('testRole').parent().find('td').last().find('div>a').eq(1)
      .click()
    // 将角色名称置空
    cy.get('#roleName').clear()
    // 将角色排序置空
    cy.get('#sort > div.ant-input-number-input-wrap > input').clear()
    // 点击确定
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 开始验证提示的错误信息
    cy.get('.ant-message').contains('校验失败').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('请输入角色名称').should('be.visible')
    cy.get('.ant-form-explain').eq(1).contains('请输入角色排序').should('be.visible')

    // 点击取消
    cy.get('.ant-modal-footer').contains('取 消').click()
  })

  it.skip('role-update-03 进行非法的数据输入', () => {
    // 点击testRole所在行的“修改”按钮
    cy.get('tbody').contains('testRole').parent().find('td').last().find('div>a').eq(1)
      .click()
    // 将角色编码置空
    cy.get('#roleAlias').clear().type('TR')
    // 点击确定
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 开始验证错误的提示信息
    cy.get('.ant-message').contains('校验失败').should('be.visible')
    cy.get('.ant-form-explain').eq(0).contains('只能是3-64个英文字符、数字或连字符').should('be.visible')
    // 点击取消
    cy.get('.ant-modal-footer').contains('取 消').click()
  })

  it('role-update-04 验证重复修改', () => {
    // 点击testRole所在行的“修改”按钮
    cy.get('tbody').contains('testRole').parent().find('td').last().find('div>a').eq(1)
      .click()
    // 将角色编码置空
    cy.get('input[placeholder="请输入角色编码"]').clear().type('superadmin')
    // 点击确定
    cy.get('.ant-modal-footer').contains('确 定').click()
    // 开始验证错误的提示信息
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为superadmin的角色记录已经存在！')
  })

  it('role-delete-01 直接删除父角色', () => {
    // 勾选角色编码为“user"的复选框
    cy.get('tbody>tr').contains('用户').prev().click()
    // 点击删除按钮
    cy.get('tbody>tr').contains('用户').parent().find('td').eq(4).find('a').eq(2)
      .click()
    //  点击确定按钮
    cy.get('div.ant-popover-buttons').contains('确 定').click()
    // 验证错误的提示信息
    cy.get('.ant-notification-notice-description').contains('请先删除子角色!').should('be.visible')
    // 取消勾选角色编码为“user"的复选框
    cy.get('tbody>tr').contains('用户').prev().click()

    // 验证
    cy.get('tbody>tr').contains('用户').should('have.text', '用户')
    cy.get('tbody>tr').contains('用户').next().should('have.text', 'user')
    cy.get('tbody>tr').contains('用户').next().next().should('have.text', '2')
  })

  it('role-delete-02 无选择数据批量删除', () => {
    // 点击user所在行的“+”按钮，展开菜单
    cy.get('.ant-table-row-collapsed').click()
    // 点击“批量删除”按钮
    cy.get('.ant-btn-danger').click()

    // 开始验证
    cy.get('.ant-message').contains('请选择至少一条数据').should('be.visible')
    cy.get('tbody>tr').contains('用户').should('have.text', '用户')
    cy.get('tbody>tr').contains('用户').next().should('have.text', 'user')
    cy.get('tbody>tr').contains('用户').next().next().should('have.text', '2')
  })

  it('role-delete-03 单个删除角色信息', () => {
    // 点击user所在行的“+”按钮，展开菜单
    cy.get('.ant-table-row-collapsed').click()
    // 投选testRole所在行的复选框
    cy.get('tbody').contains('testRole').prev().click()
    // 点击删除按钮
    cy.get('tbody').contains('testRole').parent().find('td').last().find('div>a').eq(2)
      .click()
    // 点击弹框中的“确定”按钮
    cy.get('.ant-popover-buttons').contains('确 定').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    cy.get('tbody').contains('testRole').should('not.exist')
  })

  it('role-delete-04 批量删除角色信息', () => {
    // 点击user所在行的“+”按钮，展开菜单
    cy.get('.ant-table-row-collapsed').click()
    // 勾选manager所在的复选框
    cy.get('tbody').contains('经理').prev('td').click()
    // 勾选boss所在的复选框
    cy.get('tbody').contains('老板').prev('td').click()
    // 点击“批量删除”按钮
    cy.get('.ant-btn-danger').click()
    // 点击确定按钮
    cy.get('.ant-modal-confirm-btns').contains('是').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    cy.get('tbody').contains('老板').should('not.exist')
    cy.get('tbody').contains('经理').should('not.exist')
  })

  it('role-sonMenu-01 删除子集菜单 ', () => {
    // 点击superadmin所在行的“子集菜单设置”按钮
    cy.get('.ant-table-tbody>').eq(0).contains('superadmin').next().next().contains('授予顶级菜单').click()
    // 取消勾选“默认顶部”的复选框
    cy.get('.ant-tree-treenode-checkbox-checked').eq(0).contains('默认顶部').parent().prev().click()
    // 点击确定按钮
    cy.get('.ant-modal-footer').contains('确 定').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    // 刷新页面
    cy.reload()
    cy.get('.topMenuWarp').contains('默认顶部').should('not.exist')
  })
})

context('Role-1', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.toModuleNoTopMenu('系统管理', '角色及授权管理', false)
  })

  it('role-sonMenu-01 添加子集菜单 ', () => {
    // 点击superadmin所在行的“子集菜单设置”按钮
    cy.get('.ant-table-tbody>').eq(0).contains('superadmin').next().next().contains('授予顶级菜单').click()
    // 勾选“默认顶部”的复选框
    cy.get('.ant-tree-node-content-wrapper-normal').eq(0).contains('默认顶部').parent().prev().click()
    // 点击确定按钮
    cy.get('.ant-modal-footer').contains('确 定').click()

    // 开始验证
    cy.get('.ant-message').contains('操作成功').should('be.visible')
    // 刷新页面
    cy.reload()
    cy.get('.topMenuWarp').contains('默认顶部').should('be.visible')
  })
})
