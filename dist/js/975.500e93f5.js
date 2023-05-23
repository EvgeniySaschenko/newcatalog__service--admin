"use strict";(self["webpackChunkadmin"]=self["webpackChunkadmin"]||[]).push([[975],{975:function(e,a,t){t.r(a),t.d(a,{default:function(){return m}});var i=t(6252),n=t(3577);const s={class:"page page--ratings container"},o={class:"page__title"},l={class:"u-text-center"},r={class:"u-text-center"},g={key:0},u={class:"u-center u-mt--10"};function p(e,a,t,p,d,c){const w=(0,i.up)("el-button"),h=(0,i.up)("router-link"),m=(0,i.up)("el-table-column"),f=(0,i.up)("el-tag"),$=(0,i.up)("el-text"),b=(0,i.up)("el-table"),k=(0,i.up)("el-pagination");return(0,i.wg)(),(0,i.iD)("div",s,[(0,i._)("h1",o,(0,n.zw)(e.$t(e.$route.name))+" - "+(0,n.zw)(e.$t("Page"))+" "+(0,n.zw)(e.pagination.page),1),(0,i.Wm)(h,{class:"inline-block",to:`${e.pathPage}/create`},{default:(0,i.w5)((()=>[(0,i.Wm)(w,{type:"primary",icon:"el-icon-plus"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.$t("Create a new rating")),1)])),_:1})])),_:1},8,["to"]),(0,i.Wm)(b,{data:e.ratings,stripe:"","scrollbar-always-on":!0},{default:(0,i.w5)((()=>[(0,i.Wm)(m,{label:"#",type:"index",index:e.calcNumberRecord},null,8,["index"]),(0,i.Wm)(m,{label:e.$t("Name")},{default:(0,i.w5)((a=>[(0,i.Wm)(h,{class:"u-m--5",to:`${e.pathPage}/${a.row.ratingId}`},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(a.row.name[e.$langDefault("site")]||`#${a.row.ratingId} - ${e.$langDefault("site")}`),1)])),_:2},1032,["to"]),(0,i._)("div",null,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(a.row.sectionsIds,(a=>((0,i.wg)(),(0,i.j4)(f,{class:"u-m--5",type:"warning",effect:"plain"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.sectionsMap[a].name[e.$langDefault("site")]),1)])),_:2},1024)))),256))])])),_:1},8,["label"]),(0,i.Wm)(m,{label:e.$t("Hidden"),width:"150"},{default:(0,i.w5)((a=>[a.row.isHiden?((0,i.wg)(),(0,i.j4)(f,{key:0,type:"info",effect:"dark"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.$t("Hidden")),1)])),_:1})):(0,i.kq)("",!0)])),_:1},8,["label"]),(0,i.Wm)(m,{label:e.$t("Date of first publication"),width:"150"},{default:(0,i.w5)((a=>[(0,i._)("div",l,[(0,i._)("div",null,(0,n.zw)(e.$utils.date(a.row.dateFirstPublication)),1),(0,i.Wm)($,{type:"info"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.$utils.time(a.row.dateFirstPublication)),1)])),_:2},1024)])])),_:1},8,["label"]),(0,i.Wm)(m,{label:e.$t("Cache creation date"),width:"150"},{default:(0,i.w5)((a=>[(0,i._)("div",r,[a.row.dateCacheCreation?((0,i.wg)(),(0,i.iD)("div",g,[(0,i._)("div",null,(0,n.zw)(e.$utils.date(a.row.dateCacheCreation)),1),(0,i.Wm)($,{type:"info"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.$utils.time(a.row.dateCacheCreation)),1)])),_:2},1024)])):((0,i.wg)(),(0,i.j4)(f,{key:1,class:"u-mb--5",type:"warning",effect:"dark"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(e.$t("Not published")),1)])),_:1}))])])),_:1},8,["label"])])),_:1},8,["data"]),(0,i._)("div",u,[e.pagination.pagesCount>1?((0,i.wg)(),(0,i.j4)(k,{key:0,"page-size":e.pagination.maxRecordsPerPage,layout:"prev, pager, next",total:e.pagination.itemsCount,background:"",onCurrentChange:a[0]||(a[0]=a=>e.changePage(a)),"current-page":e.pagination.page,"onUpdate:current-page":a[1]||(a[1]=a=>e.pagination.page=a)},null,8,["page-size","total","current-page"])):(0,i.kq)("",!0)])])}t(7658);var d=t(180),c=(0,i.aZ)({name:"page-ratings",data(){return{isLoading:!1,pathPage:window.location.pathname,ratings:[],pagination:{page:1,itemsCount:0,maxRecordsPerPage:0,pagesCount:0},sectionsMap:{}}},mounted(){let e=(0,d.Z)();for(let a of e.$state.items)this.sectionsMap[a.sectionId]=a;this.getRatings()},watch:{$route:{async handler(e,a){e.path===a.path&&await this.getRatings()}}},methods:{async getRatings(){this.isLoading=!0;let{page:e}=this.$route.query;this.pagination.page=Number(e)||1;try{let{items:e,page:a,itemsCount:t,maxRecordsPerPage:i,pagesCount:n}=await this.$api["ratings"].getRatings({page:this.pagination.page});this.ratings=e,this.pagination={page:a,itemsCount:t,maxRecordsPerPage:i,pagesCount:n}}catch(a){this.$utils.showMessageError({message:a.server,errors:a})}finally{this.isLoading=!1}},async changePage(e){this.pagination.page=e,this.$router.push({query:{page:e}}),window.scrollTo({top:0,behavior:"smooth"}),this.isLoading=!1},calcNumberRecord(e){let{maxRecordsPerPage:a,page:t}=this.pagination;return(t-1)*a+(e+1)}}}),w=t(3744);const h=(0,w.Z)(c,[["render",p]]);var m=h}}]);
//# sourceMappingURL=975.500e93f5.js.map