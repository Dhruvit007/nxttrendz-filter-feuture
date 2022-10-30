import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import './index.css'

class FiltersGroup extends Component {
  state = {input: ''}

  onChangeSearchInput = event => {
    const {changeSearchInput} = this.props
    if (event.key === 'Enter') {
      changeSearchInput(event.target.value)
    }
  }

  onChangeInput = event => {
    this.setState({input: event.target.value})
  }

  onChangeCategory = event => {
    const {changeCategory} = this.props
    changeCategory(event.currentTarget.value)
  }

  onChangeRating = event => {
    const {changeRating} = this.props
    changeRating(event.currentTarget.value)
  }

  onClickClearFilter = () => {
    const {clickClearFilter} = this.props
    this.setState({input: ''})
    clickClearFilter()
  }

  render() {
    const {categoryOptions, ratingsList} = this.props
    const {input} = this.state
    return (
      <div className="filters-group-container">
        <div className="input-container">
          <input
            onKeyDown={this.onChangeSearchInput}
            onChange={this.onChangeInput}
            className="input-element"
            type="search"
            placeholder="Search"
            value={input}
          />
          <BsSearch />
        </div>
        <div>
          <h1 className="category-heading">Category</h1>
          <ul className="category-item-container">
            {categoryOptions.map(eachCategory => (
              <li className="category-item">
                <button
                  onClick={this.onChangeCategory}
                  type="button"
                  value={eachCategory.categoryId}
                  className="category-btn"
                >
                  <p>{eachCategory.name}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="rating-container-heading">Rating</p>
          <ul className="rating-item-container">
            {ratingsList.map(eachList => (
              <li className="rating-item">
                <button
                  onClick={this.onChangeRating}
                  type="button"
                  value={eachList.ratingId}
                  className="rating-item-btn"
                >
                  <img
                    src={eachList.imageUrl}
                    alt={`rating ${eachList.ratingId}`}
                    className="rating-image"
                  />
                  <p>&up</p>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={this.onClickClearFilter}
            className="clear-filter-btn"
            type="button"
          >
            Clear Filters
          </button>
        </div>
      </div>
    )
  }
}

export default FiltersGroup
