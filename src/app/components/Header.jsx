import React from 'react'
//import { useDispatch, useSelector } from 'react-redux' // setup for next js

import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
//import SearchBox from './SearchBox'
//import { logout } from '../actions/userActions' // avoid actions

import * as Icon from 'react-bootstrap-icons'
import Link from 'next/link'

// TODO Redux, uncomment and solve

const Header = () => {
  // const dispatch = useDispatch()
  // const userLogin = useSelector((state) => state.userLogin)
  // const { userInfo } = userLogin

  // const cart = useSelector((state) => state.cart)
  // const { cartItems } = cart

  // const logoutHandler = () => {
  //   dispatch(logout())
  // }
  return (
    <header>
      {/* grey navbar no mobile */}

      <Navbar expand="lg" className="grey-navbar-top no-mobile">
        <Container>
          <div className="grey-navbar-flex">
            <Link href="/contact" className="grey-navbar-top-contact">
              <p className="grey-navbar-contact">Kontakt</p>
            </Link>
          </div>
          <div className="grey-navbar-two-links">
            <Link href="/cart" className="grey-navbar-cart">
              <div>
                <p className="number-in-cart ">{/* <span>{cartItems.length}</span> */}</p>

                <Icon.Cart2 className="header-basket">Košík</Icon.Cart2>
              </div>
            </Link>
            {/* {userInfo ? (
              <NavDropdown title={userInfo.name} id="username">
                <Link href="profile">
                  <NavDropdown.Item>Můj profil</NavDropdown.Item>
                </Link>
                <NavDropdown.Item onClick={logoutHandler}>Odhlásit se</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link href="/login" className="grey-navbar-sign-in">
                <Nav.Link>
                  <Icon.Person className="header-user" /> Přihlášení
                </Nav.Link>
              </Link>
            )}
            {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
              <NavDropdown className="admin-menu" title="Admin" id="adminmenu">
                <Link href="/admin/userlist">
                  <NavDropdown.Item>Uživatelé</NavDropdown.Item>
                </Link>
                <Link href="/admin/productlist">
                  <NavDropdown.Item>Produkty</NavDropdown.Item>
                </Link>
                <Link href="/admin/orderlist">
                  <NavDropdown.Item>Objednávky</NavDropdown.Item>
                </Link>
                <Link href="/admin/audio">
                  <NavDropdown.Item>Audio</NavDropdown.Item>
                </Link>
                <Link href="/admin/video">
                  <NavDropdown.Item>Video</NavDropdown.Item>
                </Link>
                <Link href="/admin/banner">
                  <NavDropdown.Item>Bannery</NavDropdown.Item>
                </Link>
                <Link href="/admin/subscribers">
                  <NavDropdown.Item>Odběratelé novinek</NavDropdown.Item>
                </Link>
              </NavDropdown>
            )}
            {userInfo && userInfo.isAssistant && (
              <NavDropdown title="Asistent" id="adminmenu">
                <Link href="/admin/audio">
                  <NavDropdown.Item>Audio</NavDropdown.Item>
                </Link>
                <Link href="/admin/video">
                  <NavDropdown.Item>Video</NavDropdown.Item>
                </Link>
                <Link href="/admin/banner">
                  <NavDropdown.Item>Bannery</NavDropdown.Item>
                </Link>
              </NavDropdown>
            )} */}
          </div>
        </Container>
      </Navbar>
      {/* Header with Logo ... */}
      <div className="top-container no-mobile container">
        <div>
          <Link href="/" className="no-underline">
            <img src="/images/wwwproudbanner.png" className="header-image" alt="prud-zivota"></img>
          </Link>
          <h3 className="header-publisher">Přinášet bohatství Božího slova všemu Božímu lidu</h3>
        </div>
        <div className="header-search-box">{/* <SearchBox /> */}</div>
      </div>
      {/* Red Navbar, on Mobile is Grey with Toggle */}
      <Navbar variant="dark" expand="lg" collapseOnSelect>
        <div className="red-navbar-container">
          <Container>
            <div>
              <div className="mobile-navbar mobile-only">
                <div className="mobile-sign-in mobile-only">
                  {/* {userInfo ? (
                    <NavDropdown title={userInfo.name} id="username">
                      <Link href="profile">
                        <NavDropdown.Item>Můj profil</NavDropdown.Item>
                      </Link>
                      <NavDropdown.Item onClick={logoutHandler}>Odhlásit se</NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <Link href="/login">
                      <Nav.Link className="mobile-sign-in">
                        <Icon.Person className="header-user" />
                      </Nav.Link>
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
                    <NavDropdown title="Admin" id="adminmenu">
                      <Link href="/admin/userlist">
                        <NavDropdown.Item>Uživatelé</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/productlist">
                        <NavDropdown.Item>Produkty</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/orderlist">
                        <NavDropdown.Item>Objednávky</NavDropdown.Item>
                      </Link>

                      <Link href="/admin/audio">
                        <NavDropdown.Item>Audio</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/video">
                        <NavDropdown.Item>Video</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/banner">
                        <NavDropdown.Item>Bannery</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/subscribers">
                        <NavDropdown.Item>Odběratelé novinek</NavDropdown.Item>
                      </Link>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isAssistant && (
                    <NavDropdown title="Asistent" id="adminmenu">
                      <Link href="/admin/audio">
                        <NavDropdown.Item>Audio</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/video">
                        <NavDropdown.Item>Video</NavDropdown.Item>
                      </Link>
                      <Link href="/admin/banner">
                        <NavDropdown.Item>Bannery</NavDropdown.Item>
                      </Link>
                    </NavDropdown>
                  )} */}
                </div>

                <div className="mobile-cart mobile-only">
                  <Link href="/cart" className="header-cart mobile-only">
                    <div>
                      <p className="number-in-cart">{/* <span>{cartItems.length}</span> */}</p>
                      <Icon.Cart className="header-cart" />
                    </div>
                  </Link>
                </div>
                <Link href="favorites" className="favorites-heart">
                  <Icon.HeartFill className="header-heart" />
                </Link>
              </div>
            </div>
          </Container>
          <div aria-controls="basic-navbar-nav" />
          <div className="mobile-navbar-collapse" id="basic-navbar-nav">
            <NavDropdown title="Novinky" className="red-navbar-item">
              <Link href="new-books/2025">
                <NavDropdown.Item>Knihy 2025</NavDropdown.Item>
              </Link>
            </NavDropdown>
            <NavDropdown title="Podcast" className="red-navbar-item">
              <Link href="words-of-life">
                <NavDropdown.Item>Slova života</NavDropdown.Item>
              </Link>
              <Link href="life-study">
                <NavDropdown.Item>Studium života</NavDropdown.Item>
              </Link>
            </NavDropdown>
            <Link href="/video">
              <div className="red-navbar-item">Video</div>
            </Link>
            <NavDropdown title="E-shop" className="red-navbar-item">
              <Link href="eshop/abecedný-zoznam-kníh">
                <NavDropdown.Item>Abecední seznam knih</NavDropdown.Item>
              </Link>
              <Link href="eshop/Boží-ekonomie">
                <NavDropdown.Item>Boží ekonomie</NavDropdown.Item>
              </Link>
              <Link href="eshop/brožury">
                <NavDropdown.Item>Brožury</NavDropdown.Item>
              </Link>
              <Link href="eshop/církev">
                <NavDropdown.Item>Církev</NavDropdown.Item>
              </Link>
              <Link href="eshop/duch">
                <NavDropdown.Item>Duch</NavDropdown.Item>
              </Link>
              <Link href="eshop/evangelium">
                <NavDropdown.Item>Evangelium</NavDropdown.Item>
              </Link>
              <Link href="eshop/kristus">
                <NavDropdown.Item>Kristus</NavDropdown.Item>
              </Link>
              <Link href="eshop/křesťanská-praxe">
                <NavDropdown.Item>Křesťanská praxe</NavDropdown.Item>
              </Link>
              <Link href="eshop/křesťanská-služba">
                <NavDropdown.Item>Křesťanská služba</NavDropdown.Item>
              </Link>
              <Link href="eshop/letáky">
                <NavDropdown.Item>Letáky</NavDropdown.Item>
              </Link>
              <Link href="eshop/mládež">
                <NavDropdown.Item>Mládež</NavDropdown.Item>
              </Link>
              <Link href="eshop/studium-a-výklad-bible">
                <NavDropdown.Item>Studium a výklad Bible</NavDropdown.Item>
              </Link>
              <Link href="eshop/Trojjediný-Bůh">
                <NavDropdown.Item>Trojjediný Bůh</NavDropdown.Item>
              </Link>
              <Link href="eshop/život">
                <NavDropdown.Item>Život</NavDropdown.Item>
              </Link>
              <Link href="eshop/životopisné">
                <NavDropdown.Item>Životopisné</NavDropdown.Item>
              </Link>
            </NavDropdown>
            <Link href="/library">
              <div className="red-navbar-item">Čítárna</div>
            </Link>
            <NavDropdown title="Info" className="red-navbar-item">
              <Link href="watchman-nee">
                <NavDropdown.Item>Watchman Nee</NavDropdown.Item>
              </Link>
              <Link href="witness-lee">
                <NavDropdown.Item>Witness Lee</NavDropdown.Item>
              </Link>
              <Link href="about">
                <NavDropdown.Item>O nás</NavDropdown.Item>
              </Link>
              <Link href="safety-privacy">
                <NavDropdown.Item>Bezpečnost a soukromí</NavDropdown.Item>
              </Link>
            </NavDropdown>
            <Link href="/contact">
              <div className="red-navbar-item">Kontakt</div>
            </Link>

            <Link href="favorites" className="no-mobile">
              <Icon.HeartFill className="header-heart-white" />
            </Link>
          </div>
        </div>
      </Navbar>
      <div className="mobile-logo-under-grey mobile-only">
        <Link href="/" className="no-underline">
          <img
            src="/images/wwwproudbanner.png"
            className="img-mobile-logo-under-grey"
            alt="prud-zivota"
          ></img>
          <p className="mobile-under-grey-publisher">
            Přinášet bohatství Božího lidu všemu Božímu lidu
          </p>
        </Link>

        <div className="search-navbar-mobile mobile-only">{/* <SearchBox /> */}</div>
      </div>
    </header>
  )
}

export default Header
