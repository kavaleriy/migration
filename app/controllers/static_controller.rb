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

  def download1
    send_file(
        "#{Rails.root}/public/Довідник.pdf",
        filename: "Довідник.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download2
    send_file(
        "#{Rails.root}/public/Соціальний захист.pdf",
        filename: "Соціальний захист.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download3
    send_file(
        "#{Rails.root}/public/Пошук роботи.pdf",
        filename: "Пошук роботи.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download4
    send_file(
        "#{Rails.root}/public/Реєстрація.pdf",
        filename: "Реєстрація.pdf",
        type: "application/pdf",
        :x_sendfile=>true
    )
  end

  def download5
    send_file(
        "#{Rails.root}/public/Q&A_VPO_23.01.2015.doc",
        filename: "Q&A_VPO_23.01.2015.doc",
        type: "application/doc",
        :x_sendfile=>true
    )
  end

end
