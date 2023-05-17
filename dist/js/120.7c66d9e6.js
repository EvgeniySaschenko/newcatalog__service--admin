"use strict";(self["webpackChunkadmin"]=self["webpackChunkadmin"]||[]).push([[120],{4120:function(a,t,e){e.r(t),e.d(t,{default:function(){return w}});var i=e(6252),n=e(3577);const s={class:"page page--ratings container"},o={class:"page__title"},g={key:0},r={class:"u-center"};function l(a,t,e,l,p,u){const c=(0,i.up)("el-button"),d=(0,i.up)("router-link"),w=(0,i.up)("el-tag"),h=(0,i.up)("el-table-column"),m=(0,i.up)("el-table"),f=(0,i.up)("el-pagination");return(0,i.wg)(),(0,i.iD)("div",s,[(0,i._)("h1",o,(0,n.zw)(a.$t(a.$route.name)),1),(0,i.Wm)(d,{class:"inline-block",to:`${a.pathPage}/create`},{default:(0,i.w5)((()=>[(0,i.Wm)(c,{type:"primary",icon:"el-icon-plus"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(a.$t("Create a new rating")),1)])),_:1})])),_:1},8,["to"]),(0,i.Wm)(m,{data:a.ratings,stripe:"","scrollbar-always-on":!0},{default:(0,i.w5)((()=>[(0,i.Wm)(h,{label:a.$t("Name")},{default:(0,i.w5)((t=>[(0,i.Wm)(d,{class:"u-m--5",to:`${a.pathPage}/${t.row.ratingId}`},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.row.name[a.$langDefault("site")]||`#${t.row.ratingId} - ${a.$langDefault("site")}`),1)])),_:2},1032,["to"]),(0,i._)("div",null,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(t.row.sectionsIds,(t=>((0,i.wg)(),(0,i.j4)(w,{class:"u-m--5",type:"warning",effect:"plain"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(a.sectionsMap[t].name[a.$langDefault("site")]),1)])),_:2},1024)))),256))])])),_:1},8,["label"]),(0,i.Wm)(h,{label:a.$t("Date of first publication"),width:"150"},{default:(0,i.w5)((t=>[(0,i.Uk)((0,n.zw)(a.$utils.date(t.row.dateFirstPublication)),1)])),_:1},8,["label"]),(0,i.Wm)(h,{label:a.$t("Cache creation date"),width:"150"},{default:(0,i.w5)((t=>[t.row.dateCacheCreation?((0,i.wg)(),(0,i.iD)("span",g,(0,n.zw)(a.$utils.date(t.row.dateCacheCreation,"datetime")),1)):((0,i.wg)(),(0,i.j4)(w,{key:1,type:"info",effect:"dark"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(a.$t("Not published")),1)])),_:1}))])),_:1},8,["label"])])),_:1},8,["data"]),(0,i._)("div",r,[a.pagination.pagesCount>1?((0,i.wg)(),(0,i.j4)(f,{key:0,"page-size":a.pagination.maxRecordsPerPage,layout:"prev, pager, next",total:a.pagination.itemsCount,background:"",onCurrentChange:t[0]||(t[0]=t=>a.changePage(t)),"current-page":a.pagination.page,"onUpdate:current-page":t[1]||(t[1]=t=>a.pagination.page=t)},null,8,["page-size","total","current-page"])):(0,i.kq)("",!0)])])}var p=e(180),u=(0,i.aZ)({name:"page-ratings",data(){return{isLoading:!1,pathPage:window.location.pathname,ratings:[],pagination:{page:1,itemsCount:0,maxRecordsPerPage:0,pagesCount:0},sectionsMap:{}}},mounted(){this.init();let a=(0,p.Z)();for(let t of a.$state.items)this.sectionsMap[t.sectionId]=t},methods:{async init(){await this.getRatings()},async getRatings(){if(!this.isLoading){this.isLoading=!0;try{let{items:a,page:t,itemsCount:e,maxRecordsPerPage:i,pagesCount:n}=await this.$api["ratings"].getRatings({page:this.pagination.page});this.ratings=a,this.pagination={page:t,itemsCount:e,maxRecordsPerPage:i,pagesCount:n}}catch(a){this.$utils.showMessageError({message:a.server,errors:a})}finally{this.isLoading=!1}}},async changePage(a){this.pagination.page=a,await this.getRatings(),window.scrollTo({top:0,behavior:"smooth"}),this.isLoading=!1}}}),c=e(3744);const d=(0,c.Z)(u,[["render",l]]);var w=d}}]);
//# sourceMappingURL=120.7c66d9e6.js.map