class ApplicationController < ActionController::Base
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => "Помилка авторизації: #{exception.message}"
  end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_news

  def set_news
    @news_items = NewsItem.where(:published => true).paginate(:page => params[:page], :per_page => 6)
  end

end
