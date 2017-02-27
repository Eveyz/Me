class WelcomepagesController < ApplicationController

  def legaloffice

  end

  def assign_case
    
  end

  def check_document
    
  end

  def ipo
    
  end

  def send_message
    
  end

  def check_qualification
    
  end

  def check_contact_qualification
    @qualify = true
    sender = params[:sender]
    receiver = params[:receiver]
    sender_id = Personnel.find_by(name: sender).id
    receiver_id = Personnel.find_by(name: receiver).id
    @cases = Case.where('completion IS NOT NULL AND personnel_id = ?', sender_id)
    if @cases.present?
      @cases.each do |c|
        @old_case = Case.where('C2 = ? AND personnel_id = ?', c.C2, receiver_id)
        break
      end
      if @old_case.present?
        @qualify = false
        p @old_case.size
        p @old_case.first.id
      end
      p @qualify
    end
    render json: @qualify, status: :ok
  end

  def contact
    @contact_list = Personnel.where.not(name: "ipo").pluck(:name)
  end

end
