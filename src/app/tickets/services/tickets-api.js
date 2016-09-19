'use strict';

angular
  .module('inspinia')
  .factory('ticketsAPI', function(requestService, dataService) {
    var apiURL = 'companies/{companyId}/tickets';
    var re = /{companyId}/;

    var TicketsList = function TicketsList() {
      this.params = [];
    };

    TicketsList.prototype.get = function(pSize, pNr) {
      var url = apiURL.replace(re, dataService.getCurrentCompanyId());

      if (angular.isNumber(pSize)) { this.params.push('pageSize=' + pSize); }
      if (angular.isNumber(pNr)) { this.params.push('pageNr=' + pNr); }

      if (this.params.length > 0) { url += '?' + this.params.join('&'); }

      return requestService.ttGet(url);
    };

    TicketsList.prototype.search = function(sTerm) {
      if (angular.isString(sTerm)) { this.params.push('searchTerm=' + sTerm); }

      return this;
    };

    TicketsList.prototype.projectIds = function(ids) {
      if (angular.isNumber(ids))
        this.params.push('projectIds=' + ids);
      else if (angular.isArray(ids))
        this.params.push('projectIds=' + ids.join(','));

      return this;
    };

    TicketsList.prototype.createdBy = function(users) {
      if (angular.isNumber(users))
        this.params.push('createdByUserIds=' + users);
      else if (angular.isArray(users))
        this.params.push('createdByUserIds=' + users.join(','));

      return this;
    };

    TicketsList.prototype.requestedBy = function(users) {
      if (angular.isNumber(users))
        this.params.push('requestedByUserIds=' + users);
      else if (angular.isArray(users))
        this.params.push('requestedByUserIds=' + users.join(','));

      return this;
    };

    TicketsList.prototype.assigneToUsers = function(users) {
      if (angular.isNumber(users))
        this.params.push('assignedToUserIds=' + users);
      else if (angular.isArray(users))
        this.params.push('assignedToUserIds=' + users.join(','));

      return this;
    };

    TicketsList.prototype.assigneToTeams = function(teams) {
      if (angular.isNumber(teams))
        this.params.push('assignedToTeamIds=' + teams);
      else if (angular.isArray(teams))
        this.params.push('assignedToTeamIds=' + teams.join(','));

      return this;
    };

    TicketsList.prototype.sort = function(field, asc) {
      if (angular.isString(field)) { this.params.push('sort=' + field); }
      if (asc === true) { this.params.push('order=asc'); }

      return this;
    };

    TicketsList.prototype.priority = function(id) {
      if (id > -1) { this.params.push('priority=' + id); }

      return this;
    };

    return {
      getList: function() { return new TicketsList(); },
      get: function(ticketId) {
        return requestService.ttGet(apiURL.replace(re, dataService.getCurrentCompanyId()) + '/' + ticketId);
      },
      getActions: function(ticketId, actions, pSize, pNr, sTerm) {
        var url = apiURL.replace(re, dataService.getCurrentCompanyId()) + '/' + ticketId + '/actions';

        if (arguments.length > 1) { url += '?'; }
        if (angular.isArray(actions)) { url += '&actionTypes=' + actions.join(); }
        if (angular.isNumber(pSize)) { url += '&pageSize=' + pSize; }
        if (angular.isNumber(pNr)) { url += '&pageNr=' + pNr; }
        if (angular.isString(sTerm)) { url += '&searchTerm=' + sTerm; }

        return requestService.ttGet(url);
      },
      create: function(projectId, ticket) {
        ticket.companyId = parseInt(dataService.getCurrentCompanyId());
        ticket.createdByUserId = dataService.getUserId();

        return requestService.ttPost(apiURL.replace(re, dataService.getCurrentCompanyId()) + '/' + projectId, ticket);
      },
      update: function(ticket, mails) {
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/"+ticket.id;
        var args = {};
        args.id = ticket.id;
        args.companyId = dataService.getCurrentCompanyId();
        args.projectId = ticket.projectId;
        args.project = ticket.project;

        

        
        args.createdByUserId = ticket.createdByUserId;
        args.createdByUser = ticket.createdByUser;

        args.status = ticket.status;
        args.priority = ticket.priority;

        args.subject = ticket.subject;
        args.description = ticket.description;

        args.deadline = new Date(ticket.deadline).getTime();

        args.createdByUser = dataService.getUser();

        
        
        args.attachedMails = mails;
        args.dueDate = "today";

        return requestService.ttPut(url, args);
      },
      setStatus: function(status, ticket) {
        var args = {};
        args.status = Number(status.id);
        args.id = Number(ticket.id);
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/status";
        return requestService.ttPut(url,args);
      },
      setPriority: function(priority, ticket) {
        var args = {};
        args.priority = Number(priority.id);
        args.id = Number(ticket.id);
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/priority";
        return requestService.ttPut(url,args);
      },
      commentTicket: function(ticket) {
        var args = {};
        args.actionType = Number(0);
        args.comment = ticket.comment;
        //args.parentActionId = Number(ticket.id);
        args.ticketId = Number(ticket.id);
        args.user = dataService.getUser();
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/comments";
        return requestService.ttPost(url,args);
      },
      addClientsToTicket: function(ticket) {
        var args = {};
        args.clients = ticket.clients;
        ticket.ticketId = Number(ticket.id);
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/requesters";
        return requestService.ttPost(url,ticket);
      },
      addMembersToTicket: function(ticket) {
        var args = {};
        args.members = ticket.members;
        ticket.ticketId = Number(ticket.id);
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/members";
        return requestService.ttPost(url,ticket);
      },
      addTeamsToTicket: function(ticket) {
        var args = {};
        args.members = ticket.members;
        ticket.ticketId = Number(ticket.id);
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/teams";
        return requestService.ttPost(url,ticket);
      },
      setProjectToTicket: function(ticket) {
        var args = {};
        ticket.ticketId = Number(ticket.id);
        ticket.projectId = Number(ticket.project.id);
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id;
        return requestService.ttPut(url,ticket);
      },
      detachEmailConversation: function(ticket, email) {
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/attachedmails/" + email.id;
        return requestService.ttDelete(url);
      },
      delete: function(ticket) {
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id;

        return requestService.ttDelete(url);
      },
      comment: function(ticket) {
        var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/comments";
        var args = {};
        args.companyId = dataService.getCurrentCompanyId();
        args.createdByUser = dataService.getUser();
        args.title = ticket.title;
        args.description = ticket.description;
        args.attachedMails = mails;
        args.dueDate = "today";

        return requestService.ttPost(url, args);
      },
      attachEmail: function(ticketId, emailId) {
        var url = apiURL.replace(re, dataService.getCurrentCompanyId()) + '/' + ticketId + '/mails/' + emailId;

        return requestService.ttPost(url);
        // var url = "companies/" + dataService.getCurrentCompanyId() + "/tickets/" + ticket.id + "/mails" + email.id;
        // var args = {};
        // args.companyId = dataService.getCurrentCompanyId();
        // args.createdByUser = dataService.getUser();
        // args.title = ticket.title;
        // args.description = ticket.description;
        // args.attachedMails = mails;
        // args.dueDate = "today";

        // return requestService.ttPost(url, args);
      }
    };
  });