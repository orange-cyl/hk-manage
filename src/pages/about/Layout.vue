<template>
  <div class="about">
    <!-- <el-button @click='handleClick'>open</el-button>
    <about-dialog :dialogVisible="dialogVisible"/> -->
    <!-- 关于我们 -->
    <!-- <el-button @click='handleClick'>open</el-button> -->
    <!-- <about-dialog :dialogVisible="dialogVisible"/> -->
    <div class="article">
      <div class="article_body">
        <div class="top">
          <img src="@/assets/aboutUs_images/aboutUs.1a06763.jpeg" alt="">
        </div>
        <div class="bottom">
          <div>公司简介</div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>上海俊悦光纤网络科技有限公司成立于2002年，现有注册资金人民币3000万。是一家专业从事电磁屏蔽机房工程、智能综合布线工程、防战争防灾难云计算大数据IDC、智慧城市总体解决方案、保密会议室建设、云计算、智能屏蔽机柜系列产品和信息设备机房和产品的研制、设计、制造、安装和施工，并集销售与服务于一体的高科技企业。</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>本公司具有《建筑智能化工程承包资质》、《涉及国家秘密的计算机系统集成屏蔽室建设》、《涉及国家秘密的计算机系统集成综合布线》、《信息系统集成及服务资质证书》、《电磁屏蔽机房D级证书》、《电磁屏蔽机柜C级证书》等资质，同时拥有《电磁屏蔽室屏蔽网络线过壁装置》等多项发明专利证书,并通过ISO9001质量体系认证。</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>本公司研发的屏蔽系列工程和智慧城市方案广泛应用于全国各省市党、政、军、警、航空、航天、船舶等重要企业的涉密计算机信息网络系统、各省市街道，为国家政务网、公务网、党务网信息化建设作出了应有的贡献。</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>本公司坚持以“质量第一，服务至上”为理念，以一流的技术、卓越的品质、优良的售后服务为宗旨。</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>本公司近年来迅速扩展，员工队伍不断壮大，专业素质不断提高，在用户中享有较高的声誉。</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>联系电话：021-69921798。 </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import AboutDialog from './AboutDialog'
// export default {
//   data(){
//     return {
//       dialogVisible:false
//     }
//   },
//   components:{
//     aboutDialog:AboutDialog
//   },
//   methods:{
//     handleClick(){
//       this.dialogVisible = true;
//     }
//   }
// }
import $ from 'jquery'
// import AboutDialog from './AboutDialog'
export default {
  components: {
    // aboutDialog: AboutDialog
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  mounted() {
    // 表格高度
    $('.article_body').height($(window).height() - 148)
  },
  methods: {
    handleClick() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
  /* .about {
    margin: 1em;
    background: #ffffff;
    border-radius: 3px;
    padding: 1em;
  } */
  .article {
    width: 1400px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    margin: 0 auto
  }
  .article_body {
    /* min-height: 771px; */
    width: 1200px;
    /* border: 1px solid pink; */
    margin: 0 auto
  }
  .article_body > .top > img{
    width: 100%;
    height: 250px
  }
  .article_body > .bottom  div{
    font-size: 20px;
    margin-top: 1em;
    margin-bottom: .5em;
    text-align: center
  }
  .article_body > .bottom  span{
    font-size: 17px;
    line-height: 30px
  }
</style>
