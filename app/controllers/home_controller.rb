class HomeController < ApplicationController
  before_action :set_housing

  def index
    @area = Koatuu.areas_to_json.collect { |area| [ area[:name], area[:id] ] }
    @house = House.all.collect { |i| [ i.name, i.id.to_s ] }

    respond_to do |format|
      format.js { render :index }
      format.html
    end
  end

  def map
  end

  private
  def set_housing
    params[:home_search_region] ||= ''
    params[:home_search_area] ||= ''
    params[:home_search_rubric] ||= ''
    koatuu = params[:home_search_region].slice(0,5)
    koatuu = params[:home_search_area].slice(0,2) if koatuu.empty?

    scool = params[:home_search_has_school]
    has_kgarden = params[:home_search_has_kgarden]

    @housings = Housing.where('qty_places > 0')
    @housings = @housings.where("koatuu_code like ?", "#{koatuu}%") unless koatuu.empty?
    @housings = @housings.where(:has_school => 1) unless scool.nil?
    @housings = @housings.where(:has_kgarden => 1) unless has_kgarden.nil?

    @housings = @housings.order('koatuu_code').paginate(:page => params[:page]) if @housings



    @adverts = Advert.where('qty_places > 0')
    @adverts = @adverts.where("koatuu_code like ?", "#{koatuu}%") unless koatuu.empty?
    @adverts = @adverts.where(:has_school => 1) unless scool.nil?
    @adverts = @adverts.where(:has_kgarden => 1) unless has_kgarden.nil?

    @adverts = @adverts.order(created_at: :desc).paginate(:page => params[:adverts_page]) if @adverts


    @advert_works = AdvertWork.all
    @advert_works = @advert_works.includes(:advert).references(:advert).where("adverts.koatuu_code like ?", "#{koatuu}%") unless koatuu.empty?
    @advert_works = @advert_works.includes(:profession).references(:profession).where("professions.id" => params[:home_search_rubric]) unless params[:home_search_rubric].empty?

    # binding.pry
    @advert_works = @advert_works.order(created_at: :desc).paginate(:page => params[:advert_works_page]) if @advert_works
  end
end
