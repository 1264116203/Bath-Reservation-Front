context('TopMenu', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')

    cy.intercept('/api/system/top-menu/pagination*').as('topMenuPagination')
    cy.intercept('/api/system/authority/menu-tree').as('authorityTree')
    cy.visit('/#/system/topmenu')
    cy.wait(['@topMenuPagination', '@authorityTree']).then(() => {
    })
  })
  /* 新增顶部菜单信息 */
  it('create-top-menu 新增顶部菜单信息', function () {
    cy.toModule('系统管理', '系统管理', '顶部菜单', false)
    createTopMenuAndQuery()
    subsetMenuSettings()
  })

  /* 顶部菜单数据输入，置空部分表单 */
  it('create-top-menu-empty 顶部菜单数据输入，置空部分表单', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get('.ant-space-item > .ant-btn-primary').click()
    cy.get('input[placeholder="请输入菜单名称"]').type('测试菜单A')
    cy.get('input[placeholder="请输入菜单图标"]').click()
    cy.get(':nth-child(8) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > div > :nth-child(1)').click()
    cy.get('input[placeholder="请输入菜单图标"]').type('{selectall}{backspace}')
    cy.get('.ant-input-number-input').type('{selectall}{backspace}')
    cy.get('.ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > div > .ant-btn-primary').contains('确 定').parent().click()
    /*  ==== End Cypress Studio ====  */
    cy.get('input[placeholder="请输入菜单编码"]').parent().parent().find(':nth-child(2)').should('have.text', '请输入菜单编码')
    cy.get('input[placeholder="请输入菜单图标"]').parent().parent().find(':nth-child(2)').should('have.text', '请输入菜单图标')
    cy.get('.ant-input-number-input').parent().parent().parent().next().should('have.text', '请输入菜单排序')
    /*  ==== End Cypress Studio ====  */
    cy.get('.ant-message').should('have.text', '校验未通过！')
  })

  /* 进行非法数据输入 */
  it('create-top-menu-illegal 进行非法数据输入', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get('.ant-space-item > .ant-btn-primary').click()
    cy.get('input[placeholder="请输入菜单名称"]').type('测试菜单A')
    cy.get('input[placeholder="请输入菜单编码"]').type('12')
    cy.get('input[placeholder="请输入菜单图标"]').click()
    cy.get(':nth-child(8) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > div > :nth-child(1)').click()
    cy.get('input[placeholder="请输入菜单图标"]').type('{selectall}{backspace}').type('check-circle')
    cy.get('.ant-input-number-input').type('{selectall}{backspace}').type('abc')
    cy.get('.ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > div > .ant-btn-primary').contains('确 定').parent().click()

    cy.get('input[placeholder="请输入菜单编码"]').parent().parent().find(':nth-child(2)').should('have.text', '只能是3-64个英文字符、数字或连字符')
    cy.get('.ant-input-number-input').parent().parent().parent().next().should('have.text', '请输入菜单排序')
    /*  ==== End Cypress Studio ====  */
    cy.get('.ant-message').should('have.text', '校验未通过！')
  })

  /* 插入重复数据 */
  it('create-top-menu-duplicate 插入重复数据', function () {
    createTopMenu()
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为test-code-A的顶部菜单记录已经存在！')
  })

  /* 修改顶部菜单信息 */
  it('update-top-menu 修改顶部菜单信息', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get('.ant-table-tbody').find('.ant-table-row ').contains('test-code-A').parent().find(' :nth-child(6) > :nth-child(1) > :nth-child(2)').click()
    cy.get('input[placeholder="请输入菜单名称"]').type('{selectall}{backspace}').type('测试菜单A-update')
    cy.get('input[placeholder="请输入菜单编码"]').type('{selectall}{backspace}').type('test-code-A-update')
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    cy.get('.ant-message').wait(500).should('have.text', '数据更新成功!')
    cy.get('.ant-table-tbody > :nth-child(1) > .ant-table-row-cell-break-word > .ant-space > :nth-child(1) > a').click()
    cy.get('.ant-modal-body input').should('be.disabled').then($input => {
      cy.get($input[0]).should('have.value', '测试菜单A-update')
      cy.get($input[1]).should('have.value', 'test-code-A-update')
      cy.get($input[2]).should('have.value', 'check-circle')
      cy.get($input[3]).should('have.value', '1')
    })
    cy.get('.ant-modal-footer > div > :nth-child(1)').click()

    cy.reload()
    cy.get('#app > section > section > header > div > div.top-banner-left > div > ul > li:nth-child(2)').should('contain', '测试菜单A-update')
  })

  /* 修改顶部菜单信息时不进行任何修改 */
  it('update-top-menu-illegal 修改顶部菜单信息时不进行任何修改', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get('.ant-table-tbody').find('.ant-table-row ').contains('test-code-A').parent().find(' :nth-child(6) > :nth-child(1) > :nth-child(2)').click()
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    cy.get('.ant-message').wait(500).should('have.text', '数据更新成功!')
    cy.get('.ant-table-tbody > :nth-child(1) > .ant-table-row-cell-break-word > .ant-space > :nth-child(1) > a').click()
    cy.get('.ant-modal-body input').should('be.disabled').then($input => {
      cy.get($input[0]).should('have.value', '测试菜单A-update')
      cy.get($input[1]).should('have.value', 'test-code-A-update')
      cy.get($input[2]).should('have.value', 'check-circle')
      cy.get($input[3]).should('have.value', '1')
    })
    cy.get('.ant-modal-footer > div > :nth-child(1)').click()

    /*  ==== End Cypress Studio ====  */
  })

  /* 验证修改查重 */
  it('update-top-menu-duplicate 验证修改查重', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get('.ant-table-tbody').find('.ant-table-row ').contains('test-code-A-update')
      .siblings().last().find('a').contains('修改').click()
    cy.get('input[placeholder="请输入菜单编码"]').clear().type('default')
    cy.get('.ant-modal-footer > div > .ant-btn-primary').click()
    cy.wait(500)
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为default的顶部菜单记录已经存在！')
    /*  ==== End Cypress Studio ====  */
  })

  /* 删除顶部菜单信息 */
  it('delete-top-menu 删除顶部菜单信息', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get('.ant-table-tbody').find('.ant-table-row ').contains('测试菜单A-update').parent().find(' :nth-child(6) > .ant-space > :nth-child(3)').click()
    cy.get('.ant-popover-buttons > .ant-btn-primary').click()
    /*  ==== End Cypress Studio ====  */
    cy.get('.ant-table-tbody ').should('not.contain', '测试菜单A-update')
    cy.reload()
    cy.get('#app > section > section > header > div > div.top-banner-left > div > ul > li:nth-child(2)').should('not.contain', '测试菜单A-update')
  })

  /* 批量删除顶部菜单信息 */
  it('delete-all-top-menu 批量删除顶部菜单信息', function () {
    createTopMenu('测试菜单A', 'test-code-A')
    createTopMenu('测试菜单B', 'test-code-B')
    createTopMenu('测试菜单C', 'test-code-C')
    cy.get('.ant-table-tbody .ant-table-row').contains('测试菜单A').parent().find(' :nth-child(1) label').click()
    cy.get('.ant-table-tbody .ant-table-row').contains('测试菜单B').parent().find(' :nth-child(1) label').click()
    cy.get('.ant-table-tbody .ant-table-row').contains('测试菜单C').parent().find(' :nth-child(1) label').click()
    cy.get('.ant-btn-danger').click()
    cy.get('.ant-modal-confirm-btns > .ant-btn-danger').click()
    cy.get('.ant-table-tbody ').should('not.contain', '测试菜单A')
    cy.get('.ant-table-tbody ').should('not.contain', '测试菜单B')
    cy.get('.ant-table-tbody ').should('not.contain', '测试菜单C')
  })
  /* 模糊查询 */
  it('fuzzy-query-top-menu 模糊查询', function () {
    /*  ==== Generated with Cypress Studio ====  */
    cy.get(':nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('系统')
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()
    /*  ==== End Cypress Studio ====  */
    cy.get('.ant-table-tbody ').contains('系统管理')
  })

  /* 查询不存在的数据 */
  it('fuzzy-query-top-menu-illgeal 查询不存在的数据', function () {
    cy.get(':nth-child(1) > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input').type('未命名菜单')
    cy.get(':nth-child(3) > .ant-col > .ant-form-item-control > .ant-form-item-children > .ant-btn').click()
    cy.get('.ant-empty-description').should('have.text', '暂无数据')
  })

  /* 添加顶部菜单 */
  function createTopMenu($name, $code) {
    cy.get('.ant-space-item > .ant-btn-primary').click()
    if ($name == null) {
      cy.get('input[placeholder="请输入菜单名称"]').type('测试菜单A')
    } else {
      cy.get('input[placeholder="请输入菜单名称"]').type($name)
    }
    if ($code == null) {
      cy.get('input[placeholder="请输入菜单编码"]').type('test-code-A')
    } else {
      cy.get('input[placeholder="请输入菜单编码"]').type($code)
    }
    cy.get('input[placeholder="请输入菜单图标"]').click()
    cy.get(':nth-child(8) > .ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > div > :nth-child(1)').click()

    cy.get('input[placeholder="请输入菜单图标"]').type('{selectall}{backspace}').type('check-circle')
    cy.get('.ant-input-number-input').type('{selectall}{backspace}').type('1')
    cy.get('.ant-modal-root > .ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > div > .ant-btn-primary').contains('确 定').parent().click()
  }

  /* 添加顶部菜单并点击查看 */
  function createTopMenuAndQuery() {
    createTopMenu()
    cy.reload()

    cy.get('.ant-table-tbody > :nth-child(1) > .ant-table-row-cell-break-word > .ant-space > :nth-child(1) > a').click()
    cy.get('.ant-modal-body input').should('be.disabled').then($input => {
      cy.get($input[0]).should('have.value', '测试菜单A')
      cy.get($input[1]).should('have.value', 'test-code-A')
      cy.get($input[2]).should('have.value', 'check-circle')
      cy.get($input[3]).should('have.value', '1')
    })
    cy.get('.ant-modal-footer > div ').contains('取 消').click()
  }

  /* 将添加的顶部菜单添加到觉得及权限管理的子集菜单设置中 */
  function subsetMenuSettings() {
    cy.get('.ant-layout-sider-children > .ant-menu-root > .ant-menu-submenu > .ant-menu-submenu-title').click()
    cy.get('.ant-menu > :nth-child(2) > span').click()
    cy.reload()
    cy.get('.ant-table-tbody > :nth-child(1)> .ant-table-row-cell-break-word > .ant-space > :nth-child(5) > a').click()
    cy.get('.ant-modal-content').contains('测试菜单A').parent().prev().should('not.have.class', 'ant-tree-checkbox-checked').click()
    cy.get('.ant-modal-footer > div > .ant-btn-primary').first().wait(1000).click()
    cy.get('.ant-message').wait(500).should('have.text', '操作成功')
    cy.reload()
    cy.get('#app > section > section > header > div > div.top-banner-left > div > ul > li:nth-child(2)').contains('测试菜单A')
  }
})
