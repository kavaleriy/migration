class ApiController < ApplicationController
  def get_areas
    @areas = Koatuu.areas_to_json(params[:q])

    respond_to do |format|
      format.json { render json: @areas, status: :ok }
    end
  end

  def get_regions
    @regions = Koatuu.acities_to_json(params[:area], params[:q]) + Koatuu.regions_to_json(params[:area], params[:q])

    respond_to do |format|
      format.json { render json: @regions, status: :ok }
    end
  end

  def get_cities
  end

end
