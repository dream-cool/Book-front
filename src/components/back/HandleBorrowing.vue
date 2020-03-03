<template>
<div class="content">
  <el-container>
          <el-form :model="borrowing" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="书籍名称">
            <el-input v-model="borrowing.bookName" placeholder="模糊查询书籍名称" ></el-input>
          </el-form-item>
          <el-form-item label="借阅人">
            <el-input v-model="borrowing.userName" placeholder="模糊查询借阅人"></el-input>
          </el-form-item>
          <el-form-item label="借阅时长小于">
               <el-input-number v-model="borrowing.duration" controls-position="right"
                :min="1" :max="365"></el-input-number>
          </el-form-item>
          <el-form-item label="借阅时间早于">
              <el-form-item prop="borrowingTime">
                <el-date-picker
                 value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                 type="date" placeholder="选择日期" v-model="borrowing.borrowingTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label="申请时间早于">
              <el-form-item prop="applicationTime">
                <el-date-picker
                 value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                 type="date" placeholder="选择日期" v-model="borrowing.applicationTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <div class="operation" style="float:right; margin-right: 10%;">
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </div>
        </el-form>
      </el-container>
      <el-table
          border
          size="small"
          tooltip-effect="dark"
          :data="borrowingList"
          style="width: 100%">
          <el-table-column
            fixed
            label="书籍名称"
            width="310">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>书籍编号: {{ scope.row.bookId }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          
          <el-table-column
            label="借阅人"
            width="250">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>用户id: {{ scope.row.userId }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.userName }}</el-tag>
                </div>
               </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="申请人信誉"
            width="200">
           
            <template slot-scope="scope">
               <el-rate
                v-model="value"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
            </template>
          </el-table-column>
          <el-table-column
            prop="borrowingTime"
            label="借阅时间"
            width="150">
          </el-table-column>
          <el-table-column
            label="借阅时长"
            width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.duration }}天</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="applicationTime"
            label="申请时间"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <el-button type="success" @click="handlePass">通过</el-button>
            <el-button type="danger" @click="handleRefuse">驳回</el-button>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      value: 4.5,
      borrowingList: [],
      borrowing: {
        borrowingStatus: 1,
        duration: 365
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      borrowingStatusInfo: {
        list: [],
        obj: {}
      }
    }
  },
  created () {
    this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
  },
  methods: {
    handleSizeChange () {
    },
    handleCurrentChange () {
    },
    handlePass () {
      this.$confirm('确认通过？')
        .then(_ => {
          // axios.delete('/type/' + row.id).then(res => {
          //   if (res.data.code === 200) {
          //     this.$message(res.data.message)
          //   } else {
          //     this.$message.error(res.data.message)
          //   }
          // })
        })
        .catch(_ => {})
    },
    handleRefuse (index, row) {
      this.$prompt('请输入驳回信息', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '备注信息不能为空'
      }).then(({ value }) => {
        row.title = value
        console.log(row)
        // axios.put('/type', row).then(res => {
        //   if (res.data.code === 200) {
        //     this.$message(res.data.message)
        //   } else {
        //     this.$message.error(res.data.message)
        //   }
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消驳回'
        })
      })
    },
    search () {
      this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
    },
    resetForm () {
      this.borrowing = {
        bookName: null,
        userName: null,
        applicationTime: null,
        borrowingTime: null,
        borrowingStatus: 1,
        duration: 365
      }
      this.search()
    },
    getBorrowingInfo (pageNum, pageSize, borrowing) {
      axios.post(
        '/borrowing/all?pageNum=' + pageNum + '&pageSize=' + pageSize, borrowing
      ).then(res => {
        if (res.data.code === 200) {
          this.borrowingList = res.data.data.list
          this.pageNum = res.data.data.pageNum
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
