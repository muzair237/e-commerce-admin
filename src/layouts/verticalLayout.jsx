import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Collapse } from 'reactstrap';
import { useSelector } from 'react-redux';
import navdata from './LayoutMenuData';
import withRouter from '../components/Common/withRouter';

const VerticalLayout = props => {
  const allowedPages = useSelector(state => state.Auth.allowedPages) || [];
  const router = useRouter();
  const navData = navdata().props.children;

  function activateParentDropdown(item) {
    item.classList.add('active');
    const parentCollapseDiv = item.closest('.collapse.menu-dropdown');

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add('show');
      parentCollapseDiv.parentElement.children[0].classList.add('active');
      parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
      if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
        parentCollapseDiv.parentElement.closest('.collapse').classList.add('show');
        if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling)
          parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.classList.add('active');
        if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.closest('.collapse')) {
          parentCollapseDiv.parentElement
            .closest('.collapse')
            .previousElementSibling.closest('.collapse')
            .classList.add('show');
          parentCollapseDiv.parentElement
            .closest('.collapse')
            .previousElementSibling.closest('.collapse')
            .previousElementSibling.classList.add('active');
        }
      }
      return false;
    }
    return false;
  }
  const removeActivation = items => {
    const actiItems = items.filter(x => x.classList.contains('active'));

    actiItems.forEach(item => {
      if (item.classList.contains('menu-link')) {
        if (!item.classList.contains('active')) {
          item.setAttribute('aria-expanded', false);
        }
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
      }
      if (item.classList.contains('nav-link')) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
        item.setAttribute('aria-expanded', false);
      }
      item.classList.remove('active');
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const initMenu = () => {
      const pathName = router.pathname;
      const ul = document.getElementById('navbar-nav');
      const items = ul.getElementsByTagName('a');
      const itemsArray = [...items]; // converts NodeList to Array
      removeActivation(itemsArray);
      const matchingMenuItem = itemsArray.find(x => x.pathname === pathName);
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    if (props.layoutType === 'vertical') {
      initMenu();
    }
  }, [router.pathname, props.layoutType, props.layoutType]);

  return (
    <>
      {/* menu Items */}
      {(navData || []).map((item, itemKey) => (
        <React.Fragment key={itemKey}>
          {/* Main Header */}
          {item.isHeader ? (
            <li className="menu-title">
              <span data-key="t-menu">{item.label} </span>
            </li>
          ) : item.subItems ? (
            <li className="nav-item">
              <Link
                onClick={item.click}
                className="nav-link menu-link"
                href={item.link ? item.link : '/#'}
                data-bs-toggle="collapse">
                <i className={item.icon} />
                <span data-key="t-apps">{item.label}</span>
                {item.badgeName ? (
                  <span className={`badge badge-pill bg-${item.badgeColor}`} data-key="t-new">
                    {item.badgeName}
                  </span>
                ) : null}
              </Link>
              <Collapse className="menu-dropdown" isOpen={item.stateVariables} id="sidebarApps">
                <ul className="nav nav-sm flex-column test">
                  {/* subItems  */}
                  {item.subItems &&
                    (item.subItems || []).map((subItem, subItemKey) => (
                      <React.Fragment key={subItemKey}>
                        {!subItem.isChildItem ? (
                          <li className="nav-item">
                            <Link href={subItem.link ? subItem.link : '/#'} className="nav-link">
                              {subItem.label}
                              {subItem.badgeName ? (
                                <span className={`badge badge-pill bg-${subItem.badgeColor}`} data-key="t-new">
                                  {subItem.badgeName}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ) : (
                          <li className="nav-item">
                            <Link onClick={subItem.click} className="nav-link" href="/#" data-bs-toggle="collapse">
                              {' '}
                              {subItem.label}
                              {subItem.badgeName ? (
                                <span className={`badge badge-pill bg-${subItem.badgeColor}`} data-key="t-new">
                                  {subItem.badgeName}
                                </span>
                              ) : null}
                            </Link>
                            <Collapse className="menu-dropdown" isOpen={subItem.stateVariables} id="sidebarEcommerce">
                              <ul className="nav nav-sm flex-column">
                                {/* child subItems  */}
                                {subItem.childItems &&
                                  (subItem.childItems || []).map((childItem, childItemKey) => (
                                    <React.Fragment key={childItemKey}>
                                      {!childItem.childItems ? (
                                        <li className="nav-item">
                                          <Link href={childItem.link ? childItem.link : '/#'} className="nav-link">
                                            {childItem.label}
                                          </Link>
                                        </li>
                                      ) : (
                                        <li className="nav-item">
                                          <Link
                                            href="/#"
                                            className="nav-link"
                                            onClick={childItem.click}
                                            data-bs-toggle="collapse">
                                            {childItem.label}
                                          </Link>
                                          <Collapse
                                            className="menu-dropdown"
                                            isOpen={childItem.stateVariables}
                                            id="sidebaremailTemplates">
                                            <ul className="nav nav-sm flex-column">
                                              {childItem.childItems.map((subChildItem, subChildItemKey) => (
                                                <li className="nav-item" key={subChildItemKey}>
                                                  <Link
                                                    href={subChildItem.link}
                                                    className="nav-link"
                                                    data-key="t-basic-action">
                                                    {subChildItem.label}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          </Collapse>
                                        </li>
                                      )}
                                    </React.Fragment>
                                  ))}
                              </ul>
                            </Collapse>
                          </li>
                        )}
                      </React.Fragment>
                    ))}
                </ul>
              </Collapse>
            </li>
          ) : (
            allowedPages?.includes(item.path) && (
              <li className="nav-item">
                <Link className="nav-link menu-link" href={item.path ? item.path : '/#'}>
                  <i className={item.icon} /> <span>{item.label}</span>
                  {item.badgeName ? (
                    <span className={`badge badge-pill bg-${item.badgeColor}`} data-key="t-new">
                      {item.badgeName}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default withRouter(VerticalLayout);
