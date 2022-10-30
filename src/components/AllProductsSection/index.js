import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusContant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    categoryId: '',
    ratingId: '',
    apiStatus: apiStatusContant.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusContant.inProgress,
    })
    const {searchInput, categoryId, ratingId} = this.state
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId} = this.state
    const productsApiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${searchInput}&rating=${ratingId}`
    console.log(productsApiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(productsApiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusContant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContant.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeSearchInput = input => {
    this.setState({searchInput: input}, this.getProducts)
  }

  changeCategory = categoryId => {
    this.setState({categoryId}, this.getProducts)
  }

  changeRating = ratingId => {
    this.setState({ratingId}, this.getProducts)
  }

  clickClearFilter = () => {
    console.log('triggred')
    this.setState(
      {
        searchInput: '',
        categoryId: '',
        ratingId: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    if (productsList.length === 0) {
      return (
        <div className="no-product-section">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
            className="no-product-image"
          />
          <h1>No Products Found</h1>
          <p>We could not find any products. Try other filters</p>
        </div>
      )
    }
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="no-product-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="no-product-image"
      />
      <h1>Opps! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContant.success:
        return this.renderProductsList()
      case apiStatusContant.failure:
        return this.renderFailureView()
      case apiStatusContant.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changeSearchInput={this.changeSearchInput}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clickClearFilter={this.clickClearFilter}
          searchInput={searchInput}
        />
        {this.renderViews()}
      </div>
    )
  }
}

export default AllProductsSection
