// / <reference types="cypress" />

context('Authority', () => {
  beforeEach(() => {
    cy.login('admin', 'admin')
    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.intercept('/api/system/authority/tree').as('authorityTree')
    cy.visit('/#/system/authority')
    cy.wait(['@authorityQuery', '@authorityTree']).then(() => {
    })
  })

  it('authority-create-01', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入权限项名称"]').type('测试菜单A')
    cy.get('input[placeholder="请输入路由地址"]').type('/test-authority-a')
    cy.get('input[placeholder="请输入权限项编码"]').type('test-authority-a')
    cy.get('input.ant-input-number-input').clear().type('1')
    cy.get('textarea[placeholder="请输入备注信息"]').type('test测试备注123456789')
    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@authorityQuery').then(() => {
    })

    //  验证第一行是否插入成功
    const firstTr = cy.get('tbody.ant-table-tbody').find('tr').first()

    firstTr.find('td')
      .eq(1).should('have.text', '测试菜单A')
      .next().should('have.text', 'test-authority-a')
      .next().find('i').should('have.attr', 'aria-label', '图标: check-circle').parent()
      .next().should('have.text', '菜单项')
      .next().should('have.text', '/test-authority-a')
      .next().should('have.text', 1)
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('button.ant-switch').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')

    cy.get('input[placeholder="请输入权限项名称"]').should('have.value', '测试菜单A')
    cy.get('div.ant-modal-content').find('input').last().should('have.value', '/test-authority-a')
    cy.get('input[placeholder="请输入权限项编码"]').should('have.value', 'test-authority-a')
    cy.get('span.ant-select-selection__rendered').should('have.text', '顶级权限项')
    cy.get('input[placeholder="请选择图标"]').should('have.value', 'check-circle')
    cy.get('input.ant-input-number-input').should('have.value', 1)
    cy.get('button.ant-switch').first().should('have.text', '否')
    cy.get('button.ant-switch').last().should('have.text', '否')
    cy.get('input[type="radio"]').first().should('be.checked')
    cy.get('input[type="radio"]').last().should('not.checked')
    cy.get('div.ant-modal-content').find('textarea').last().should('have.value', 'test测试备注123456789')
    cy.get('button.ant-modal-close').click()

    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入权限项名称"]').type('测试菜单B')
    cy.get('input[placeholder="请输入路由地址"]').type('/test-authority-b')
    cy.get('input[placeholder="请输入权限项编码"]').type('test-authority-b')
    cy.get('input[placeholder="请选择图标"]').click()
    cy.get('div.ant-modal-content').find('span.ant-tabs-tab-next-icon').click()
    cy.get('div.ant-modal-content').find('div.ant-tabs-nav-scroll')
      .find('div.ant-tabs-tab').contains('数据类图标').click()
    cy.get('div.ant-tabs-card-content').find('div[aria-hidden=false]')
      .find('i[aria-label="图标: radar-chart"]').click()
    cy.get('input.ant-input-number-input').clear().type(999)
    cy.get('button.ant-switch').first().click()
    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').first().click()
    cy.wait('@authorityQuery').then(() => {
    })

    //  操作完毕开始进行验证
    //  验证第一行是否插入成功
    const lastTr = cy.get('tbody.ant-table-tbody').find('tr').last()

    lastTr.find('td')
      .eq(1).should('have.text', '测试菜单B')
      .next().should('have.text', 'test-authority-b')
      .next().find('i').should('have.attr', 'aria-label', '图标: radar-chart').parent()
      .next().should('have.text', '菜单项')
      .next().should('have.text', '/test-authority-b')
      .next().should('have.text', 999)
  })

  it('authority-create-02 新增菜单权限数据，滞空部分表单数据', () => {
    cy.get('button').contains('添 加').parent().click()
    cy.get('input.ant-input-number-input').clear().type(0)
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    //  操作完毕开始进行验证
    cy.get('.ant-message').should('have.text', '校验未通过！')

    cy.get('input[placeholder="请输入权限项名称"]').parent().parent()
      .should('have.text', '请输入名称')
    cy.get('input[placeholder="请输入权限项编码"]').parent().parent()
      .should('have.text', '请输入编码')
  })

  it('authority-create-03 新增菜单权限数据，输入非法数据', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入权限项名称"]').type('测试菜单A')
    cy.get('input[placeholder="请输入路由地址"]').type('/test-authority-a')
    cy.get('input[placeholder="请输入权限项编码"]').type('A1')
    cy.get('input.ant-input-number-input').clear().type(0)
    cy.get('textarea[placeholder="请输入备注信息"]').type('test测试备注123456789')

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    //  操作完毕开始进行验证
    cy.get('.ant-message').should('have.text', '校验未通过！')

    cy.get('input[placeholder="请输入权限项编码"]').parent().parent()
      .should('have.text', '只能是3-64个英文字符、数字或连字符')
  })

  it('authority-create-04 插入子权限菜单数据', () => {
    cy.get('button').contains('添 加').parent().click()
    cy.get('input[placeholder="请输入权限项名称"]').type('测试菜单C')
    cy.get('input[placeholder="请输入路由地址"]').type('/test-authority-c')
    cy.get('input[placeholder="请输入权限项编码"]').type('test-authority-c')
    cy.get('span.ant-select-selection--single').click()

    cy.get('div.ant-select-dropdown-placement-bottomLeft').scrollTo('bottom')
    cy.get('div.ant-select-dropdown-placement-bottomLeft').scrollTo('bottom')
    cy.get('div#rc-tree-select-list_1').find('li').contains('测试菜单A').click()
    cy.get('input.ant-input-number-input').clear().type(0)
    cy.get('textarea[placeholder="请输入备注信息"]').type('测试备注123456789')

    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@authorityQuery').then(() => {
    })

    //  验证第一行是否插入成功
    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试菜单A').parent()
      .find('div.ant-table-row-collapsed').click()

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('测试菜单C').should('be.exist')
      .next().should('have.text', 'test-authority-c')
      .next().find('i').should('have.attr', 'aria-label', '图标: check-circle').parent()
      .next().should('have.text', '菜单项')
      .next().should('have.text', '/test-authority-c')
      .next().should('have.text', 0)
      .next().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('button.ant-switch').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')

    cy.get('input[placeholder="请输入权限项名称"]').should('have.value', '测试菜单C')
    cy.get('div.ant-modal-content').find('input').last().should('have.value', '/test-authority-c')
    cy.get('input[placeholder="请输入权限项编码"]').should('have.value', 'test-authority-c')
    cy.get('span.ant-select-selection__rendered').should('have.text', '测试菜单A')
    cy.get('input[placeholder="请选择图标"]').should('have.value', 'check-circle')
    cy.get('input.ant-input-number-input').should('have.value', 0)
    cy.get('button.ant-switch').first().should('have.text', '否')
    cy.get('button.ant-switch').last().should('have.text', '否')
    cy.get('input[type="radio"]').first().should('be.checked')
    cy.get('input[type="radio"]').last().should('not.checked')
    cy.get('div.ant-modal-content').find('textarea').last().should('have.value', '测试备注123456789')
  })

  it('authority-create-05 新增重复编码数据', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入权限项名称"]').type('测试菜单A')
    cy.get('input[placeholder="请输入路由地址"]').type('/test-authority-a')
    cy.get('input[placeholder="请输入权限项编码"]').type('test-authority-a')
    cy.get('input.ant-input-number-input').clear().type('1')
    cy.get('textarea[placeholder="请输入备注信息"]').type('test测试备注123456789')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    //  操作完毕开始进行验证
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为test-authority-a的权限项记录已经存在！')
  })

  it('authority-update-01 修改权限菜单数据-前置条件', () => {
    cy.intercept('/api/system/role/query').as('roleQuery')
    cy.intercept('/api/system/authority/tree').as('authorityTree')
    cy.intercept('/api/system/top-menu/list').as('topMenuList')
    cy.intercept('/api/system/role/tree').as('roleTree')
    cy.visit('/#/authority/role')
    cy.wait(['@roleQuery', '@authorityTree', '@topMenuList', '@roleTree']).then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('超级管理员').siblings().last()
      .find('a').contains('授予权限').click()

    cy.get('div.ant-modal-body').find('div.ant-spin-container > div')
      .scrollTo('bottom', { duration: 200 })
    cy.get('div.ant-modal-body').find('div.ant-spin-container > div')
      .find('span[title="测试菜单A"]').siblings('span.ant-tree-checkbox').click()
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()

    cy.visit('/#/main/home')

    cy.intercept('/api/system/top-menu/pagination').as('topMenuPagination')
    cy.intercept('/api/system/authority/tree').as('authorityTree')
    cy.visit('/#/system/topmenu')
    cy.wait(['@topMenuPagination', '@authorityTree']).then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr > td')
      .contains('系统管理').siblings().last()
      .find('a').contains('指定菜单项').click()

    cy.get('div.ant-modal-header').contains('下级菜单配置').parent().next()
      .find('div.ant-spin-container > div')
      .scrollTo('bottom', { duration: 200 })
    cy.get('div.ant-modal-header').contains('下级菜单配置').parent().next()
      .find('div.ant-spin-container > div')
      .find('span[title="测试菜单A"]').siblings('span.ant-tree-checkbox').click()

    cy.get('div.ant-modal-header').contains('下级菜单配置').parent().next().next()
      .find('button.ant-btn-primary').click()
  })

  it('authority-update-01 修改权限菜单数据', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .last().find('a').contains('修改').click()

    cy.get('input[placeholder="请输入权限项名称"]').clear().type('测试菜单A-update')
    cy.get('input[placeholder="请输入路由地址"]').clear().type('/test-authority-a-update')
    cy.get('input[placeholder="请输入权限项编码"]').clear().type('test-authority-a-update')
    cy.get('textarea[placeholder="请输入备注信息"]').clear().type('test测试备注123456789-update')

    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@authorityQuery').then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr').first()
      .find('td')
      .eq(1).should('have.text', '测试菜单A-update')
      .next().should('have.text', 'test-authority-a-update')
      .next().next().next().should('have.text', '/test-authority-a-update')
      .siblings().last().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('button.ant-switch').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')

    cy.get('input[placeholder="请输入权限项名称"]').should('have.value', '测试菜单A-update')
    cy.get('div.ant-modal-content').find('input').last().should('have.value', '/test-authority-a-update')
    cy.get('input[placeholder="请输入权限项编码"]').should('have.value', 'test-authority-a-update')
    cy.get('span[title="顶级权限项"]').should('have.text', '顶级权限项')
    cy.get('input[placeholder="请选择图标"]').should('have.value', 'check-circle')
    cy.get('input.ant-input-number-input').should('have.value', 1)
    cy.get('button.ant-switch').first().should('have.text', '否')
    cy.get('button.ant-switch').last().should('have.text', '否')
    cy.get('input[type="radio"]').first().should('be.checked')
    cy.get('input[type="radio"]').last().should('not.checked')
    cy.get('div.ant-modal-content').find('textarea').last().should('have.value', 'test测试备注123456789-update')
    cy.get('button.ant-modal-close').click()

    cy.intercept('/api/system/authority/current-user/menu-tree*').as('currentMenuTree')
    cy.toModule('系统管理', '系统管理', '权限与菜单管理', false)
    cy.wait('@currentMenuTree').then(() => {
      cy.get('ul.ant-menu-dark')
        .find('li.ant-menu-submenu-inline')
        .find('div.ant-menu-submenu-title')
        .contains('测试菜单A-update').should('be.exist')
    })
  })

  it('authority-update-02 修改时不进行任何编辑直接保存', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .last().find('a').contains('修改').click()
    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait('@authorityQuery').then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr').first()
      .find('td')
      .last().find('a').contains('查看').click()

    cy.get('div.ant-modal-content').find('input').should('be.disabled')
    cy.get('div.ant-modal-content').find('button.ant-switch').should('be.disabled')
    cy.get('div.ant-modal-content').find('span.ant-select')
      .should('have.class', 'ant-select-disabled')
    cy.get('div.ant-modal-content').find('textarea').should('be.disabled')

    cy.get('input[placeholder="请输入权限项名称"]').should('have.value', '测试菜单A-update')
    cy.get('div.ant-modal-content').find('input').last().should('have.value', '/test-authority-a-update')
    cy.get('input[placeholder="请输入权限项编码"]').should('have.value', 'test-authority-a-update')
    cy.get('span[title="顶级权限项"]').should('have.text', '顶级权限项')
    cy.get('input[placeholder="请选择图标"]').should('have.value', 'check-circle')
    cy.get('input.ant-input-number-input').should('have.value', 1)
    cy.get('button.ant-switch').first().should('have.text', '否')
    cy.get('button.ant-switch').last().should('have.text', '否')
    cy.get('input[type="radio"]').first().should('be.checked')
    cy.get('input[type="radio"]').last().should('not.checked')
    cy.get('div.ant-modal-content').find('textarea').last().should('have.value', 'test测试备注123456789-update')
  })

  it('authority-update-03 验证修改查重', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .last().find('a').contains('修改').click()

    cy.get('input[placeholder="请输入权限项编码"]').clear().type('test-authority-b')

    cy.get('div.ant-modal-content').find('button.ant-btn-primary').click()
    cy.wait(500)

    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '编码为test-authority-b的权限项记录已经存在！')
  })

  it('authority-delete-01 删除有子节点的父节点', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .last().find('a').contains('删除').click()
    cy.get('div.ant-popover-buttons').find('button').first().click()
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).should('have.text', '测试菜单A-update')
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .last().find('a').contains('删除').click()
    cy.get('div.ant-popover-buttons').find('button').last().click().wait(200)
    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '请先删除子节点!')
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).should('have.text', '测试菜单A-update')
  })

  it('authority-delete-02 正常删除无子节点的父节点', () => {
    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).should('have.text', '测试菜单B')
    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .last().find('a').contains('删除').click()
    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-popover-buttons').find('button').last().click().wait(500)
    cy.wait('@authorityQuery').then(() => {
      cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
        .eq(1).should('have.text', '系统管理')
      cy.get('tbody.ant-table-tbody').find('tr > td').contains('测试菜单B').should('not.exist')
    })
  })

  it('authority-delete-03 父子同时进行批量删除', () => {
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).find('div.ant-table-row-collapsed').click()
      .parent().parent().find('td').first()
      .find('input.ant-checkbox-input').click()

    cy.get('button.ant-btn-danger').click()
    cy.get('div.ant-modal-body').find('button.ant-btn-danger').click()

    cy.get('div.ant-notification-notice-message').should('have.text', '请求失败')
      .next().should('have.text', '请先删除子节点!')
    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).should('have.text', '测试菜单A-update')
  })

  it('authority-delete-04 先删除子节点后批量删除父节点', () => {
    cy.get('button').contains('添 加').parent().click()

    cy.get('input[placeholder="请输入权限项名称"]').type('测试菜单D')
    cy.get('input[placeholder="请输入路由地址"]').type('/test-authority-d')
    cy.get('input[placeholder="请输入权限项编码"]').type('test-authority-d')
    cy.get('input.ant-input-number-input').clear().type(1000)

    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.get('div.ant-modal-content').find('button.ant-btn-primary').first().click()
    cy.wait('@authorityQuery').then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).find('div.ant-table-row-collapsed').click()
    cy.get('tbody.ant-table-tbody').find('tr').eq(1).find('td')
      .last().find('a').contains('删除').click()
    cy.get('div.ant-popover-buttons').find('button').last().click().wait(200)

    cy.get('tbody.ant-table-tbody').find('tr > td').contains('测试菜单C').should('not.exist')

    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).should('have.text', '测试菜单D')

    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .first().find('input.ant-checkbox-input').click()
    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .first().find('input.ant-checkbox-input').click()

    cy.get('button.ant-btn-danger').click()

    cy.intercept('/api/system/authority/query*').as('authorityQuery')
    cy.intercept('/api/system/authority/batch*').as('authorityDelete')
    cy.get('div.ant-modal-body').find('button.ant-btn-danger').click()
    cy.wait(2000)
    cy.wait(['@authorityQuery', '@authorityDelete']).then(() => {
    })

    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).should('have.text', '系统监控')

    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).should('have.text', '系统管理')

    cy.get('tbody.ant-table-tbody').find('tr > td').contains('测试菜单A-update').should('not.exist')
    cy.get('tbody.ant-table-tbody').find('tr > td').contains('测试菜单D').should('not.exist')

    cy.intercept('/api/system/authority/current-user/menu-tree*').as('currentMenuTree')
    cy.reload()
    cy.wait('@currentMenuTree').then(() => {
    })
    cy.get('ul.ant-menu-dark')
      .find('li.ant-menu-submenu-inline')
      .find('div.ant-menu-submenu-title')
      .contains('测试菜单A-update').should('not.exist')
  })

  it('authority-select-01 按菜单名称进行模糊查询', () => {
    cy.get('input.ant-input').first().type('系统')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.get('tbody.ant-table-tbody').find('tr')
      .should('have.length', 2)

    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).find('div.ant-table-row-collapsed').click()
    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).should('have.text', '系统参数')
    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).find('div.ant-table-row-collapsed').click()
    cy.get('tbody.ant-table-tbody').find('tr').last().find('td')
      .eq(1).should('have.text', '系统参数数据管理')
  })

  it('authority-select-02 按菜单名称进行模糊查询', () => {
    cy.get('input.ant-input').last().type('sys')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.get('tbody.ant-table-tbody').find('tr')
      .should('have.length', 1)

    cy.get('tbody.ant-table-tbody').find('tr').first().find('td')
      .eq(1).should('have.text', '系统管理')
  })

  it('authority-select-03 输入匹配不到的关键字进行查询', () => {
    cy.get('input.ant-input').first().type('未命名菜单#')
    cy.get('button.ant-btn-primary')
      .contains('搜 索').parent().click()
    cy.get('tbody.ant-table-tbody').should('have.html', '')
    cy.get('p.ant-empty-description').should('have.text', '暂无数据')
  })
})
