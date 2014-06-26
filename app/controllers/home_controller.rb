class HomeController < ApplicationController
  before_action :set_housing

  def index
    @area = Koatuu.areas_to_json.collect { |area| [ area[:name], area[:id] ] }
    @house = House.all.collect { |i| [ i.name, i.id.to_s ] }
  end

  def search
    respond_to do |format|
      format.js
    end
  end

  private
  def set_housing
    params[:home_search_region] ||= ''
    params[:home_search_area] ||= ''

    koatuu = params[:home_search_region].slice(0,5)
    koatuu = params[:home_search_area].slice(0,2) if koatuu.empty?

    scool = params[:home_search_has_school]
    has_kgarden = params[:home_search_has_kgarden]

    @housings = Housing.where('qty_places > 0')
    @housings = @housings.where("koatuu_code like '#{koatuu}%'") unless koatuu.empty?
    @housings = @housings.where(:has_school => 1) unless scool.nil?
    @housings = @housings.where(:has_kgarden => 1) unless has_kgarden.nil?

    @housings = @housings.paginate(:page => params[:page]) if @housings
  end
end
