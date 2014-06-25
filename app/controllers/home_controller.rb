class HomeController < ApplicationController
  def index
    @area = Koatuu.areas_to_json.collect { |area| [ area[:name], area[:id] ] }
    @house = House.all.collect { |i| [ i.name, i.id.to_s ] }
  end

  def search
    koatuu = params[:home_search_region].slice(0,5)
    koatuu = params[:home_search_area].slice(0,2) if koatuu.empty?

    scool = params[:home_search_has_school]
    has_kgarden = params[:home_search_has_kgarden]
    work = params[:home_search_has_work]


    @housings = (@housings || Housing).where("koatuu_code like '#{koatuu}%'") unless koatuu.empty?
    @housings = (@housings || Housing).where(:has_school => 1) unless scool.nil?
    @housings = (@housings || Housing).where(:has_kgarden => 1) unless has_kgarden.nil?
    # @housings = @housings.where(:has_work => 1) unless work.nil?

    respond_to do |format|
      format.js
    end
  end

end
