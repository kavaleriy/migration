class StaticController < ApplicationController
  def centers
  end

  def documents
  end

  # Список регіональних підрозділів Державної міграційної служби
  def dms
  end

  # Список регіональних підрозділів служби Соціального захисту населення
  def sz
  end

  def zd
  end

  def download_roadmap_v4
    send_file(
        "#{Rails.root}/public/static_download_roadmap_20141217.pdf",
        filename: "download_roadmap_20141217.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download_roadmap1
    send_file(
        "#{Rails.root}/public/Дорожная карта (КМУ, Минсоцполитики).pdf",
        filename: "Дорожная карта (КМУ, Минсоцполитики).pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download_roadmap2
    send_file(
        "#{Rails.root}/public/UNDP_employm_IDPsUkraine.pdf",
        filename: "UNDP_employm_IDPsUkraine.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download_roadmap3
    send_file(
        "#{Rails.root}/public/2014_09-05-dor_kart.pdf",
        filename: "2014_09-05-dor_kart.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

end
