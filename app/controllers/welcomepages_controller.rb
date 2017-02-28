class WelcomepagesController < ApplicationController

  def legaloffice

  end

  def assign_case

  end

  def check_document
    @documents = Document.all.pluck(:name)
    @personnels = Personnel.where.not(name: "ipo").pluck(:name)
  end

  def check_document_qualification
    @qualify = true
    document = params[:document]
    personnel = params[:personnel]
    document_company_id = Document.find_by(name: document).company_id
    company_name = Company.find(document_company_id).name
    personnel_id = Personnel.find_by(name: personnel).id
    @cases = Case.where('completion IS NOT NULL AND personnel_id = ?', personnel_id)
    if @cases.present?
      @cases.each do |ca|
        if ca.c2 == company_name
          @qualify = false
          break
        end
      end
    end
    render json: @qualify, status: :ok
  end

  def ipo
    @legal_contacts = Contact.where(legal: true).order('created_at DESC')
    @illegal_contacts = Contact.where(legal: false).order('created_at DESC')
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
    p "ID"
    # p @cases.first.id
    if @cases.present?
      @cases.each do |ca|
        @match_case = ca
        @conflict_cases1 = Case.where("c1 = ? AND personnel_id = ?", ca.c2, receiver_id)
        @conflict_cases2 = Case.where("c2 = ? AND personnel_id = ?", ca.c1, receiver_id)
        break
      end
      if @conflict_cases1.present? or @conflict_cases2.present?
        @qualify = false
      end
      p @qualify
    end
    # Contact.create!(sender: sender, receiver: receiver, legal: @qualify)
    response = { qualify: @qualify, match_case: @match_case, conflict_cases1: @conflict_cases1, conflict_cases2: @conflict_cases2 }
    render json: response, status: :ok
  end

  def contact
    @contact_list = Personnel.where.not(name: "ipo").pluck(:name)
  end

end
